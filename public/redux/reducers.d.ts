import { TaskObject } from '../models/types';
interface TaskReducer {
    tasks: TaskMap;
}
interface TaskMap {
    [key: TaskObject['key']]: TaskObject;
}
declare const tasksReducer: (state: {
    tasks: {};
} | undefined, action: any) => TaskReducer;
export default tasksReducer;
