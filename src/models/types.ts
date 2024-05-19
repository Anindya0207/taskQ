export interface StorageOptions {
  add: (task: TaskObject) => any;
  getAll: () => TaskMap;
  search: (taskKey: string) => Partial<TaskObject>;
  edit: (args: EditConfig) => any;
  delete: (key: string) => any;
  deleteBulk: (keys: string[]) => any;
  deleteAll: () => any;
  getDBFileName?: () => string;
}

export interface TaskQConfigs {
  storage?: StorageOptions;
  sortExecutionBucket?: (tasks: ExecutingTask[]) => TaskObject[];
  shouldExecute: (args: ShouldExecuteArgs) => boolean;
  doExecute: (task: ExecutingTask) => Promise<any>;
  onSuccess?: (task: ExecutingTask, response: SuccessResponse) => void;
  onFailure?: (task: ExecutingTask, response: FailureResponse) => void;
  getRetryAfter?: (task: ExecutingTask) => number;
  characteristics?: UserSpecifiableCharacteristics;
  concurrancyDemanded?: number;
  keepSuccessResponse?: boolean;
  networkConfig?: Partial<NetworkConfig>;
}

type TaskState = 'INIT' | 'PROCESSING' | 'SUCCESS' | 'FAILURE' | 'TERMINATED';

interface ShouldExecuteArgs {
  isOnline: boolean;
  task: TaskObject;
}

interface SuccessResponse {
  code: number;
  response: any;
}

interface FailureResponse {
  code: number;
  message: string;
}

export interface UserSpecifiableCharacteristics {
  serverEndpoint?: string;
  serverUrl?: string;
  data?: {
    [k: string]: any;
  };
  headers?: any;
}

interface Characteristics extends UserSpecifiableCharacteristics {
  failedAttempts?: number;
  lastSuccessResponse?: SuccessResponse | null;
  lastFailureResponse?: FailureResponse | null;
  addedAt?: number;
  lastAttemptedAt?: number;
  resolvedAt?: number;
  toBeRetriedAt?: number;
}

export interface TaskObject {
  key: string; // Has to be unique
  dependentTaskKeys?: string[];
  state?: TaskState;
  characteristics?: Characteristics;
}

export type ExecutingTask = Pick<
  TaskObject,
  'key' | 'characteristics' | 'dependentTaskKeys'
>;
export type UserSpecifiableTask = Omit<
  TaskObject,
  'key' | 'state' | 'characteristics'
>;

export type HTTPHeaders = {
  [key: string]: string;
};

export type AddUndefined<T> = { [P in keyof T]: T[P] | undefined };

export type HTTPMethod = 'HEAD' | 'OPTIONS';

export interface NetworkConfig {
  shouldPing: boolean;
  pingServerUrl: string;
  pingTimeout: number;
  httpMethod: HTTPMethod;
  customHeaders: HTTPHeaders;
}

export interface FilterTaskArgs {
  filter: (task: TaskObject) => boolean;
  sortBy?: 'earliest' | 'latest';
}

export interface TaskMap {
  [key: string]: TaskObject;
}

export interface RealmInterfaceConfig {
  schema: any;
  schemaVersion: number;
}

export interface EditConfig {
  key: string;
  task: TaskObject;
}

export interface InitiateRealmConfig {
  realm: typeof Realm;
  getEncryptionKey: (dkFileName: string) => Promise<string>;
}

export interface CleanupArgs {
  shouldClean: (task: TaskObject) => boolean;
}
