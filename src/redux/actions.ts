import { TaskObject } from '../models/types';

const getUUID = () => new Date().getUTCMilliseconds();

export const addTask = (task: TaskObject) => ({
  type: 'ADD_TASK',
  payload: {
    task,
  },
});
export type AddTaskType = typeof addTask;

export const resetTasks = (tasks: TaskObject[]) => ({
  type: 'RESET_TASKS',
  payload: {
    tasks,
  },
});
export type ResetTasksType = typeof resetTasks;
