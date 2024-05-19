import { TaskObject } from '../models/types';
export declare const addTask: (task: TaskObject) => {
    type: string;
    payload: {
        task: TaskObject;
    };
};
export declare type AddTaskType = typeof addTask;
export declare const resetTasks: (tasks: TaskObject[]) => {
    type: string;
    payload: {
        tasks: TaskObject[];
    };
};
export declare type ResetTasksType = typeof resetTasks;
