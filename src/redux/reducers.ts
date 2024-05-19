import { TaskObject } from '../models/types';

interface TaskReducer {
  tasks: TaskMap;
}

interface TaskMap {
  [key: TaskObject['key']]: TaskObject;
}

const INITIAL_STATE = {
  tasks: {},
};

const tasksReducer = (state = INITIAL_STATE, action: any): TaskReducer => {
  if (action.type === 'ADD_UPDATE_TASK') {
    const newTask = action.payload.task;
    return { ...state, [newTask.key]: newTask };
  }
  if (action.type === 'RESET_TASKS') {
    const newTasks = action.payload.tasks;
    return newTasks.reduce(
      (acc: TaskMap, curr: TaskObject) => ({ ...acc, [curr.key]: curr }),
      {},
    );
  }
  return state;
};

export default tasksReducer;
