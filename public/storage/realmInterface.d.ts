import { TaskObject, TaskMap, EditConfig, InitiateRealmConfig } from '../models/types';
declare class RealmInterface {
    private config;
    private realmLib;
    private realm;
    private static dbFileName;
    private constructor();
    static initialiseRealm(conf: InitiateRealmConfig): Promise<RealmInterface>;
    private openRealm;
    add(task: TaskObject): void;
    getAll(): TaskMap;
    search(key: string): Partial<TaskObject>;
    edit({ key, task }: EditConfig): void;
    delete(key: string): void;
    deleteBulk(keys: string[]): void;
    deleteAll(): void;
}
export default RealmInterface;
