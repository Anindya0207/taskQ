import { TaskQConfigs, UserSpecifiableCharacteristics, TaskObject, FilterTaskArgs, UserSpecifiableTask, CleanupArgs } from './models/types';
declare class TaskQ {
    private globalConfigs;
    private tasks;
    private alreadyRunning;
    private executionArray;
    private constructor();
    private rehydrateFromDB;
    static initialiseTaskQ(configs: TaskQConfigs): TaskQ;
    setConfig(configs: Partial<TaskQConfigs>): void;
    private canPushToExecutionBucket;
    private tSortTasks;
    private storeinDb;
    private addInTasks;
    private getUpperLimit;
    private getExecutingTask;
    private run;
    private generateTaskID;
    isTaskPending(task: TaskObject): boolean;
    isTaskSuccessful(task: TaskObject): boolean;
    isTaskFailed(task: TaskObject): boolean;
    addTask(task: UserSpecifiableTask, characteristics: UserSpecifiableCharacteristics): Promise<string>;
    searchTask(args: FilterTaskArgs): TaskObject[];
    getNetWorkState(): Promise<boolean>;
    forceStart(): Promise<void>;
    cleanup(args: CleanupArgs): void;
}
export default TaskQ;
