import { Store } from 'redux';
import {
  TaskQConfigs,
  UserSpecifiableCharacteristics,
  TaskObject,
  FilterTaskArgs,
  TaskMap,
  UserSpecifiableTask,
  ExecutingTask,
  CleanupArgs,
} from './models/types';
import getNetworkConnectivity from './utils/detectNetworkConnectivity';
// import detectPlatform from './utils/detectPlatform';
import { getRandomId } from './utils/uniqueID';

class TaskQ {
  private globalConfigs: TaskQConfigs;
  private tasks: TaskMap = {};
  private alreadyRunning: boolean = false;
  private executionArray: TaskObject[][] = [];

  private constructor(configs: TaskQConfigs) {
    this.globalConfigs = configs;
    this.rehydrateFromDB();
  }

  private async rehydrateFromDB() {
    const { storage } = this.globalConfigs;
    if (storage) {
      const rehydratedTasks = storage.getAll();
      console.log('[TASKQ]: Rehydrated tasks', rehydratedTasks);
      if (!!Object.keys(rehydratedTasks).length) {
        this.tasks = rehydratedTasks;
        await this.tSortTasks();
        this.run();
      }
    } else {
      console.info(
        '[TASKQ]: Preffred storage interface is not passed. TaskQ will work in volatile mode',
      );
    }
  }

  static initialiseTaskQ(configs: TaskQConfigs) {
    return new TaskQ(configs);
  }

  setConfig(configs: Partial<TaskQConfigs>) {
    const { characteristics = {} } = configs;
    const { characteristics: globalCharacteristics = {} } = this.globalConfigs;
    const newCharacteristics = { ...globalCharacteristics, ...characteristics };
    this.globalConfigs = {
      ...this.globalConfigs,
      ...configs,
      characteristics: newCharacteristics,
    };
  }

  private canPushToExecutionBucket(task: TaskObject, isOnline: boolean) {
    const isDependentTasksInQueue = (task.dependentTaskKeys || []).every(
      (t) => !!this.tasks[t] && this.tasks[t].state !== 'TERMINATED',
    );
    const canRetyFailedTask =
      task.state === 'FAILURE' &&
      task.characteristics?.toBeRetriedAt &&
      task.characteristics?.toBeRetriedAt > Date.now();

    const isCurrentTaskExecutable =
      task.state && (task.state === 'INIT' || canRetyFailedTask);

    const { shouldExecute } = this.globalConfigs;
    let _shouldExecute = true;
    if (shouldExecute && typeof shouldExecute === 'function') {
      _shouldExecute = shouldExecute({
        isOnline,
        task,
      });
    }
    if (isCurrentTaskExecutable && isDependentTasksInQueue && _shouldExecute) {
      return true;
    }
    return false;
  }

  private async tSortTasks() {
    let _tasks = Object.values(this.tasks);
    console.log('[TASKQ]: Grouping.....', _tasks);
    const { networkConfig = {} } = this.globalConfigs;
    const isOnline = await getNetworkConnectivity(networkConfig);
    let used: { [k in string]: boolean } = {};
    let result: TaskObject[] = [],
      items: TaskObject[] = [],
      length = 0;
    this.executionArray = [];
    do {
      length = _tasks.length;
      items = [];
      _tasks = _tasks.filter((k) => {
        if (!(k.dependentTaskKeys || []).every((_k) => !!used[_k])) return true;
        items.push(k);
      });
      const executionItems = items.filter((t) =>
        this.canPushToExecutionBucket(t, isOnline),
      );
      executionItems.length && this.executionArray.push(executionItems);
      result.push(...items);
      items.forEach((i) => {
        used[i.key] = true;
      });
    } while (_tasks.length && _tasks.length !== length);
    result.push(..._tasks);
    const finalExecutionItems = _tasks.filter((t) =>
      this.canPushToExecutionBucket(t, isOnline),
    );
    if (finalExecutionItems.length) {
      this.executionArray.push(finalExecutionItems);
    }
    if (
      !!this.executionArray.length &&
      this.globalConfigs.sortExecutionBucket &&
      typeof this.globalConfigs.sortExecutionBucket === 'function'
    ) {
      let [firstArray, ...rest] = this.executionArray;
      firstArray = this.globalConfigs.sortExecutionBucket(firstArray);
      this.executionArray = [firstArray, ...rest];
    }
    console.log('[TASKQ]: Execution array......', this.executionArray);
  }

  private topologicalSort() {
    const visited = new Set();
    const result: TaskObject[] = [];

    const dfs = (taskId: string) => {
      visited.add(taskId);
      this.tasks[taskId]?.dependentTaskKeys?.forEach((dependency) => {
        if (!visited.has(dependency)) {
          dfs(dependency);
        }
      });
      result.push(this.tasks[taskId]);
    };

    Object.keys(this.tasks).forEach((taskId) => {
      if (!visited.has(taskId)) {
        dfs(taskId);
      }
    });

    return result.reverse();
  }

  private groupTasksByExecutionOrder() {
    const executionOrder = this.topologicalSort();
    const groupedTasks: TaskObject[][] = [];

    executionOrder.forEach((task) => {
      const group = this.tasks[task.key].dependentTaskKeys || [];
      if (group.length === 0) {
        // Task has no dependencies, create a new group
        groupedTasks.push([task]);
      } else {
        // Task has dependencies, find the group for each dependency
        const dependentGroups = group.reduce((acc, dependency) => {
          const deps = groupedTasks.find((group) =>
            group.find((g) => g.key === dependency),
          );
          if (deps) {
            return [...acc, deps];
          }
          return acc;
        }, []);
        // Merge groups and add the current task
        const mergedGroup = new Array<TaskObject>().concat(
          ...dependentGroups,
          task,
        );
        // Remove duplicate tasks
        const uniqueGroup = Array.from(
          new Set(mergedGroup.map((obj) => obj.key)),
        ).map((id) => this.tasks[id]);

        groupedTasks.push(uniqueGroup);
      }
    });

    return groupedTasks;
  }

  private async tSorttasksNewDS() {
    console.log('[TASKQ]: Grouping.....', this.tasks);
    const { networkConfig = {} } = this.globalConfigs;
    const isOnline = await getNetworkConnectivity(networkConfig);
    this.executionArray = this.groupTasksByExecutionOrder();
    console.log('[TASKQ]: Execution array......', this.executionArray);
  }
  private storeinDb(task: TaskObject, mode: 'add' | 'edit', key?: string) {
    // console.log('[TASKQ]: Storing task in DB......', task.key, mode, task);

    const { storage } = this.globalConfigs;
    try {
      if (storage) {
        if (mode === 'add' && task) {
          storage.add(task);
        }
        if (mode === 'edit' && key && task) {
          storage.edit({ key, task });
        }
      } else {
        console.log(
          '[TASKQ]: Storage preferrence not passed.. skipping save to storage',
        );
      }
    } catch (err) {
      console.log(
        '[TASKQ]: Oops! something went wrong while saving in storage..',
      );
    }
  }

  private async addInTasks(task: TaskObject) {
    this.tasks = { ...this.tasks, [task.key]: task };
    await this.storeinDb(task, 'add');
    await this.tSorttasksNewDS();
    this.run();
  }

  private getUpperLimit() {
    //const platform = detectPlatform();
    const firstExecutionGroup = !!this.executionArray.length
      ? this.executionArray[0]
      : [];
    if (!firstExecutionGroup.length) return 0;
    const concurrencyDemanded = this.globalConfigs.concurrancyDemanded;
    // if (platform === 'WEB_BROWSER') {
    //   return Math.min(
    //     firstExecutionGroup.length,
    //     Math.min(concurrencyDemanded, 5),
    //   );
    // }
    // TODO: add net perf based concurrancy logic
    return concurrencyDemanded
      ? Math.min(firstExecutionGroup.length, concurrencyDemanded)
      : firstExecutionGroup.length;
  }

  private getExecutingTask(taskObject: TaskObject): ExecutingTask {
    return {
      key: taskObject.key,
      dependentTaskKeys: taskObject.dependentTaskKeys,
      characteristics: taskObject.characteristics,
    };
  }
  private run() {
    const upperLimit = this.getUpperLimit();
    const firstExecutionGroup = !!this.executionArray.length
      ? this.executionArray[0]
      : [];
    let currentExecutionGroup = firstExecutionGroup.slice(0, upperLimit);
    console.log(
      '[TASKQ]: Current Execution tasks...',
      currentExecutionGroup,
      'Already running ? ',
      this.alreadyRunning,
    );
    let total = currentExecutionGroup.length;
    let done = 0;
    const exec = async () => {
      const currentTask = currentExecutionGroup[done];
      const {
        keepSuccessResponse,
        doExecute,
        onSuccess,
        getRetryAfter,
        onFailure,
      } = this.globalConfigs;

      if (doExecute && typeof doExecute === 'function') {
        let updatedCurrentTask: TaskObject = {
          ...currentTask,
          state: 'PROCESSING',
          characteristics: {
            ...(this.tasks[currentTask.key]?.characteristics || {}),
            lastAttemptedAt: Date.now(),
            toBeRetriedAt: 0,
          },
        };

        try {
          this.storeinDb(updatedCurrentTask, 'edit', currentTask.key);
          this.tasks = {
            ...this.tasks,
            [currentTask.key]: updatedCurrentTask,
          };
          const resCurrentTask = await doExecute(
            this.getExecutingTask(updatedCurrentTask),
          );
          updatedCurrentTask = {
            ...currentTask,
            state: 'SUCCESS',
            characteristics: {
              ...(this.tasks[currentTask.key]?.characteristics || {}),
              ...(keepSuccessResponse && {
                lastSuccessResponse: resCurrentTask,
              }),
              resolvedAt: Date.now(),
            },
          };
          this.storeinDb(updatedCurrentTask, 'edit', currentTask.key);
          this.tasks = {
            ...this.tasks,
            [currentTask.key]: updatedCurrentTask,
          };
          await this.tSortTasks();
          onSuccess &&
            onSuccess(
              this.getExecutingTask(updatedCurrentTask),
              resCurrentTask,
            );
        } catch (err) {
          const failedAt = Date.now();
          const failedAtt =
            (currentTask.characteristics || {}).failedAttempts || 0;
          updatedCurrentTask = {
            ...currentTask,
            state: 'FAILURE',
            characteristics: {
              ...(this.tasks[currentTask.key]?.characteristics || {}),
              lastFailureResponse: err,
              failedAttempts: failedAtt + 1,
              resolvedAt: failedAt,
            },
          };

          const retryAfter =
            getRetryAfter &&
            getRetryAfter(this.getExecutingTask(updatedCurrentTask));
          const whenShouldItBeRetried = !isNaN(Number(retryAfter))
            ? failedAt + Number(retryAfter)
            : failedAt + 10 * 1000 * 60;
          updatedCurrentTask = {
            ...updatedCurrentTask,
            characteristics: {
              ...(updatedCurrentTask?.characteristics || {}),
              toBeRetriedAt: whenShouldItBeRetried,
            },
          };

          this.storeinDb(updatedCurrentTask, 'edit', currentTask.key);
          this.tasks = {
            ...this.tasks,
            [currentTask.key]: updatedCurrentTask,
          };
          await this.tSortTasks();
          onFailure &&
            onFailure(this.getExecutingTask(updatedCurrentTask), err);
        }
      }
      done++;
      if (done === total) {
        await this.tSortTasks();
        this.alreadyRunning = false;
        this.run();
        return;
      }
      exec();
    };
    while (done < upperLimit && !this.alreadyRunning) {
      this.alreadyRunning = true;
      exec();
    }
  }

  private generateTaskID = (key: string = 'TASK'): string => {
    const newID = `${key}-${getRandomId()}`;
    if (this.tasks[newID]) return this.generateTaskID(key);
    return newID;
  };

  //Public members

  isTaskPending(task: TaskObject) {
    return task?.state === 'INIT' || task?.state === 'PROCESSING';
  }
  isTaskSuccessful(task: TaskObject) {
    return task?.state === 'SUCCESS';
  }
  isTaskFailed(task: TaskObject) {
    return task?.state === 'FAILURE';
  }

  async addTask(
    task: UserSpecifiableTask,
    characteristics: UserSpecifiableCharacteristics,
  ): Promise<string> {
    const { characteristics: globalCharacteristics = {} } = this.globalConfigs;
    const newCharacteristics = { ...globalCharacteristics, ...characteristics };
    const tasks = Object.values(this.tasks);
    if (tasks.length > 5000) throw new Error('Max task limit exceeded');
    const generatedTaskId = this.generateTaskID();
    this.addInTasks({
      ...task,
      key: generatedTaskId,
      state: 'INIT',
      characteristics: {
        ...newCharacteristics,
        failedAttempts: 0,
        addedAt: Date.now(),
        lastSuccessResponse: null,
        lastFailureResponse: null,
      },
    });
    return generatedTaskId;
  }

  searchTask(args: FilterTaskArgs) {
    const { filter, sortBy } = args;
    let tasks = Object.values(this.tasks);
    if (sortBy) {
      tasks = tasks.sort((a, b) => {
        if (!a.characteristics?.addedAt || !b.characteristics?.addedAt)
          return 0;
        switch (sortBy) {
          case 'earliest':
            return a.characteristics?.addedAt - b.characteristics?.addedAt;
          case 'latest':
            return b.characteristics?.addedAt - a.characteristics?.addedAt;
          default:
            return 0;
        }
      });
    }
    if (filter) tasks = tasks.filter(filter);
    return tasks;
  }

  async getNetWorkState() {
    const { networkConfig = {} } = this.globalConfigs;
    const isOnline = await getNetworkConnectivity(networkConfig);
    return isOnline;
  }

  async forceStart() {
    if (this.alreadyRunning) return;
    await this.tSortTasks();
    this.run();
  }

  cleanup(args: CleanupArgs) {
    const { shouldClean } = args;
    const { storage } = this.globalConfigs;
    if (shouldClean) {
      let successfulTasks: TaskObject[] = [];
      const updatedTasks = Object.keys(this.tasks).reduce((acc, curr) => {
        const _task: TaskObject = this.tasks[curr];
        if (shouldClean(_task)) {
          successfulTasks = [...successfulTasks, _task];
          return acc;
        }
        return {
          ...acc,
          [_task.key]: _task,
        };
      }, {});
      this.tasks = updatedTasks;
      if (storage) {
        storage.deleteBulk(successfulTasks.map((t) => t.key));
      }
      return;
    }
    this.tasks = {};
    storage && storage.deleteAll();
  }
}

export default TaskQ;
