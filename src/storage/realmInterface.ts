import {
  TaskObject,
  RealmInterfaceConfig,
  TaskMap,
  EditConfig,
  InitiateRealmConfig,
} from '../models/types';
import { convertToByteArray } from './utils';

class RealmInterface {
  private config: RealmInterfaceConfig;
  private realmLib: typeof Realm;
  private realm: Realm;
  private static dbFileName: string = 'taskQ.realm';

  private constructor(_realm: typeof Realm) {
    const taskSchema = {
      name: 'Task',
      primaryKey: 'key',
      properties: {
        key: 'string',
        state: 'string',
        characteristics: 'string',
        dependentTaskKeys: 'string',
      },
    };
    this.config = {
      schema: taskSchema,
      schemaVersion: 1,
    };
    this.realmLib = _realm;
  }

  static async initialiseRealm(conf: InitiateRealmConfig) {
    const _realmInstance = new RealmInterface(conf.realm);
    let encryptionKey = '';
    if (conf.getEncryptionKey) {
      encryptionKey = await conf.getEncryptionKey(this.dbFileName);
    }
    await _realmInstance.openRealm(encryptionKey);
    return _realmInstance;
  }

  private async openRealm(_encryptionKey?: string) {
    const { schema } = this.config;
    if (schema) {
      try {
        const conf = {
          path: RealmInterface.dbFileName,
          schema: [schema],
          ...(_encryptionKey && {
            encryptionKey: convertToByteArray(_encryptionKey),
          }),
        } as Realm.Configuration;
        const exists = this.realmLib.exists(conf);
        if (exists) {
          this.realm = await this.realmLib.open(conf);
          console.log('[TASKQ]: Realm exists');
        } else {
          this.realm = new this.realmLib(conf);
          console.log('[TASKQ]: Realm does not exist');
        }
        console.log('[TASKQ]: Realm init', this.realm);
      } catch (err) {
        console.log('[TASKQ]: Error opening realm', err);
      }
    } else {
      throw new Error('Please pass a schema');
    }
  }

  add(task: TaskObject) {
    const { schema } = this.config;
    if (!this.realm || !schema) {
      throw new Error('Realm is not initialised');
    }
    const dbTask = {
      key: task.key,
      state: task.state,
      characteristics: JSON.stringify(task.characteristics || {}),
      dependentTaskKeys: JSON.stringify(task.dependentTaskKeys || []),
    };
    this.realm.write(() => {
      this.realm.create(schema.name, dbTask, this.realmLib.UpdateMode.All);
    });
  }

  getAll(): TaskMap {
    const { schema } = this.config;
    if (!this.realm || !schema) {
      throw new Error('Realm is not initialised');
    }
    let allObjects: any = this.realm.objects(schema.name).toJSON();
    return allObjects.reduce(
      (acc: any, curr: any) => ({
        ...acc,
        [curr.key]: {
          key: curr.key,
          state: curr.state,
          characteristics: JSON.parse(curr.characteristics),
          dependentTaskKeys: JSON.parse(curr.dependentTaskKeys),
        },
      }),
      {},
    );
  }

  search(key: string): Partial<TaskObject> {
    const { schema } = this.config;
    if (!this.realm || !schema) {
      throw new Error('Realm is not initialised');
    }
    const searchedObject = this.realm
      .objectForPrimaryKey(schema.name, key)
      ?.toJSON();
    return {
      key: searchedObject?.key,
      state: searchedObject?.state,
      characteristics: JSON.parse(searchedObject?.characteristics as string),
      dependentTaskKeys: JSON.parse(
        searchedObject?.dependentTaskKeys as string,
      ),
    } as any;
  }

  edit({ key, task }: EditConfig) {
    const { schema } = this.config;
    if (!this.realm || !schema) {
      throw new Error('Realm is not initialised');
    }
    const objectToUpdate = this.realm.objectForPrimaryKey(schema.name, key);
    const dbTask = {
      key: task.key,
      state: task.state,
      characteristics: JSON.stringify(task.characteristics || {}),
      dependentTaskKeys: JSON.stringify(task.dependentTaskKeys || []),
    };
    this.realm.write(() => {
      if (objectToUpdate) {
        this.realm.create(
          schema.name,
          dbTask,
          this.realmLib.UpdateMode.Modified,
        );
      }
    });
  }

  delete(key: string) {
    const { schema } = this.config;
    if (!this.realm || !schema) {
      throw new Error('Realm is not initialised');
    }
    const objectToDelete = this.realm.objectForPrimaryKey(schema.name, key);
    this.realm.write(() => {
      if (objectToDelete) {
        this.realm.delete(objectToDelete);
      }
    });
  }

  deleteBulk(keys: string[]) {
    const { schema } = this.config;
    if (!this.realm || !schema) {
      throw new Error('Realm is not initialised');
    }
    this.realm.write(() => {
      keys.forEach((key) => {
        const objectToDelete = this.realm.objectForPrimaryKey(schema.name, key);
        if (objectToDelete) {
          this.realm.delete(objectToDelete);
        }
      });
    });
  }

  deleteAll() {
    const { schema } = this.config;
    if (!this.realm || !schema) {
      throw new Error('Realm is not initialised');
    }
    this.realm.write(() => {
      this.realm.deleteAll();
    });
  }
}

export default RealmInterface;
