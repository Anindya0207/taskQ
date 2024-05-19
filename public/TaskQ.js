"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var detectNetworkConnectivity_1 = __importDefault(require("./utils/detectNetworkConnectivity"));
// import detectPlatform from './utils/detectPlatform';
var uniqueID_1 = require("./utils/uniqueID");
var TaskQ = /** @class */ (function () {
    function TaskQ(configs) {
        var _this = this;
        this.tasks = {};
        this.alreadyRunning = false;
        this.executionArray = [];
        this.generateTaskID = function (key) {
            if (key === void 0) { key = 'TASK'; }
            var newID = "".concat(key, "-").concat((0, uniqueID_1.getRandomId)());
            if (_this.tasks[newID])
                return _this.generateTaskID(key);
            return newID;
        };
        this.globalConfigs = configs;
        this.rehydrateFromDB();
    }
    TaskQ.prototype.rehydrateFromDB = function () {
        return __awaiter(this, void 0, void 0, function () {
            var storage, rehydratedTasks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        storage = this.globalConfigs.storage;
                        if (!storage) return [3 /*break*/, 3];
                        rehydratedTasks = storage.getAll();
                        console.log('[TASKQ]: Rehydrated tasks', rehydratedTasks);
                        if (!!!Object.keys(rehydratedTasks).length) return [3 /*break*/, 2];
                        this.tasks = rehydratedTasks;
                        return [4 /*yield*/, this.tSortTasks()];
                    case 1:
                        _a.sent();
                        this.run();
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        console.info('[TASKQ]: Preffred storage interface is not passed. TaskQ will work in volatile mode');
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TaskQ.initialiseTaskQ = function (configs) {
        return new TaskQ(configs);
    };
    TaskQ.prototype.setConfig = function (configs) {
        var _a = configs.characteristics, characteristics = _a === void 0 ? {} : _a;
        var _b = this.globalConfigs.characteristics, globalCharacteristics = _b === void 0 ? {} : _b;
        var newCharacteristics = __assign(__assign({}, globalCharacteristics), characteristics);
        this.globalConfigs = __assign(__assign(__assign({}, this.globalConfigs), configs), { characteristics: newCharacteristics });
    };
    TaskQ.prototype.canPushToExecutionBucket = function (task, isOnline) {
        var _this = this;
        var _a, _b;
        var isDependentTasksInQueue = (task.dependentTaskKeys || []).every(function (t) { return !!_this.tasks[t] && _this.tasks[t].state !== 'TERMINATED'; });
        var canRetyFailedTask = task.state === 'FAILURE' &&
            ((_a = task.characteristics) === null || _a === void 0 ? void 0 : _a.toBeRetriedAt) &&
            ((_b = task.characteristics) === null || _b === void 0 ? void 0 : _b.toBeRetriedAt) > Date.now();
        var isCurrentTaskExecutable = task.state && (task.state === 'INIT' || canRetyFailedTask);
        var shouldExecute = this.globalConfigs.shouldExecute;
        var _shouldExecute = true;
        if (shouldExecute && typeof shouldExecute === 'function') {
            _shouldExecute = shouldExecute({
                isOnline: isOnline,
                task: task,
            });
        }
        if (isCurrentTaskExecutable && isDependentTasksInQueue && _shouldExecute) {
            return true;
        }
        return false;
    };
    TaskQ.prototype.tSortTasks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _tasks, _a, networkConfig, isOnline, used, result, items, length, executionItems, finalExecutionItems, _b, firstArray, rest;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _tasks = Object.values(this.tasks);
                        console.log('[TASKQ]: Grouping.....', _tasks);
                        _a = this.globalConfigs.networkConfig, networkConfig = _a === void 0 ? {} : _a;
                        return [4 /*yield*/, (0, detectNetworkConnectivity_1.default)(networkConfig)];
                    case 1:
                        isOnline = _c.sent();
                        used = {};
                        result = [], items = [], length = 0;
                        this.executionArray = [];
                        do {
                            length = _tasks.length;
                            items = [];
                            _tasks = _tasks.filter(function (k) {
                                if (!(k.dependentTaskKeys || []).every(function (_k) { return !!used[_k]; }))
                                    return true;
                                items.push(k);
                            });
                            executionItems = items.filter(function (t) {
                                return _this.canPushToExecutionBucket(t, isOnline);
                            });
                            executionItems.length && this.executionArray.push(executionItems);
                            result.push.apply(result, items);
                            items.forEach(function (i) {
                                used[i.key] = true;
                            });
                        } while (_tasks.length && _tasks.length !== length);
                        result.push.apply(result, _tasks);
                        finalExecutionItems = _tasks.filter(function (t) {
                            return _this.canPushToExecutionBucket(t, isOnline);
                        });
                        if (finalExecutionItems.length) {
                            this.executionArray.push(finalExecutionItems);
                        }
                        if (!!this.executionArray.length &&
                            this.globalConfigs.sortExecutionBucket &&
                            typeof this.globalConfigs.sortExecutionBucket === 'function') {
                            _b = this.executionArray, firstArray = _b[0], rest = _b.slice(1);
                            firstArray = this.globalConfigs.sortExecutionBucket(firstArray);
                            this.executionArray = __spreadArray([firstArray], rest, true);
                        }
                        console.log('[TASKQ]: Execution array......', this.executionArray);
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskQ.prototype.storeinDb = function (task, mode, key) {
        // console.log('[TASKQ]: Storing task in DB......', task.key, mode, task);
        var storage = this.globalConfigs.storage;
        try {
            if (storage) {
                if (mode === 'add' && task) {
                    storage.add(task);
                }
                if (mode === 'edit' && key && task) {
                    storage.edit({ key: key, task: task });
                }
            }
            else {
                console.log('[TASKQ]: Storage preferrence not passed.. skipping save to storage');
            }
        }
        catch (err) {
            console.log('[TASKQ]: Oops! something went wrong while saving in storage..');
        }
    };
    TaskQ.prototype.addInTasks = function (task) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.tasks = __assign(__assign({}, this.tasks), (_a = {}, _a[task.key] = task, _a));
                        return [4 /*yield*/, this.storeinDb(task, 'add')];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.tSortTasks()];
                    case 2:
                        _b.sent();
                        this.run();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskQ.prototype.getUpperLimit = function () {
        //const platform = detectPlatform();
        var firstExecutionGroup = !!this.executionArray.length
            ? this.executionArray[0]
            : [];
        if (!firstExecutionGroup.length)
            return 0;
        var concurrencyDemanded = this.globalConfigs.concurrancyDemanded;
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
    };
    TaskQ.prototype.getExecutingTask = function (taskObject) {
        return {
            key: taskObject.key,
            dependentTaskKeys: taskObject.dependentTaskKeys,
            characteristics: taskObject.characteristics,
        };
    };
    TaskQ.prototype.run = function () {
        var _this = this;
        var upperLimit = this.getUpperLimit();
        var firstExecutionGroup = !!this.executionArray.length
            ? this.executionArray[0]
            : [];
        var currentExecutionGroup = firstExecutionGroup.slice(0, upperLimit);
        console.log('[TASKQ]: Current Execution tasks...', currentExecutionGroup, 'Already running ? ', this.alreadyRunning);
        var total = currentExecutionGroup.length;
        var done = 0;
        var exec = function () { return __awaiter(_this, void 0, void 0, function () {
            var currentTask, _a, keepSuccessResponse, doExecute, onSuccess, getRetryAfter, onFailure, updatedCurrentTask, resCurrentTask, err_1, failedAt, failedAtt, retryAfter, whenShouldItBeRetried;
            var _b, _c, _d;
            var _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        currentTask = currentExecutionGroup[done];
                        _a = this.globalConfigs, keepSuccessResponse = _a.keepSuccessResponse, doExecute = _a.doExecute, onSuccess = _a.onSuccess, getRetryAfter = _a.getRetryAfter, onFailure = _a.onFailure;
                        if (!(doExecute && typeof doExecute === 'function')) return [3 /*break*/, 6];
                        updatedCurrentTask = __assign(__assign({}, currentTask), { state: 'PROCESSING', characteristics: __assign(__assign({}, (((_e = this.tasks[currentTask.key]) === null || _e === void 0 ? void 0 : _e.characteristics) || {})), { lastAttemptedAt: Date.now(), toBeRetriedAt: 0 }) });
                        _h.label = 1;
                    case 1:
                        _h.trys.push([1, 4, , 6]);
                        this.storeinDb(updatedCurrentTask, 'edit', currentTask.key);
                        this.tasks = __assign(__assign({}, this.tasks), (_b = {}, _b[currentTask.key] = updatedCurrentTask, _b));
                        return [4 /*yield*/, doExecute(this.getExecutingTask(updatedCurrentTask))];
                    case 2:
                        resCurrentTask = _h.sent();
                        updatedCurrentTask = __assign(__assign({}, currentTask), { state: 'SUCCESS', characteristics: __assign(__assign(__assign({}, (((_f = this.tasks[currentTask.key]) === null || _f === void 0 ? void 0 : _f.characteristics) || {})), (keepSuccessResponse && {
                                lastSuccessResponse: resCurrentTask,
                            })), { resolvedAt: Date.now() }) });
                        this.storeinDb(updatedCurrentTask, 'edit', currentTask.key);
                        this.tasks = __assign(__assign({}, this.tasks), (_c = {}, _c[currentTask.key] = updatedCurrentTask, _c));
                        return [4 /*yield*/, this.tSortTasks()];
                    case 3:
                        _h.sent();
                        onSuccess &&
                            onSuccess(this.getExecutingTask(updatedCurrentTask), resCurrentTask);
                        return [3 /*break*/, 6];
                    case 4:
                        err_1 = _h.sent();
                        failedAt = Date.now();
                        failedAtt = (currentTask.characteristics || {}).failedAttempts || 0;
                        updatedCurrentTask = __assign(__assign({}, currentTask), { state: 'FAILURE', characteristics: __assign(__assign({}, (((_g = this.tasks[currentTask.key]) === null || _g === void 0 ? void 0 : _g.characteristics) || {})), { lastFailureResponse: err_1, failedAttempts: failedAtt + 1, resolvedAt: failedAt }) });
                        retryAfter = getRetryAfter &&
                            getRetryAfter(this.getExecutingTask(updatedCurrentTask));
                        whenShouldItBeRetried = !isNaN(Number(retryAfter))
                            ? failedAt + Number(retryAfter)
                            : failedAt + 10 * 1000 * 60;
                        updatedCurrentTask = __assign(__assign({}, updatedCurrentTask), { characteristics: __assign(__assign({}, ((updatedCurrentTask === null || updatedCurrentTask === void 0 ? void 0 : updatedCurrentTask.characteristics) || {})), { toBeRetriedAt: whenShouldItBeRetried }) });
                        this.storeinDb(updatedCurrentTask, 'edit', currentTask.key);
                        this.tasks = __assign(__assign({}, this.tasks), (_d = {}, _d[currentTask.key] = updatedCurrentTask, _d));
                        return [4 /*yield*/, this.tSortTasks()];
                    case 5:
                        _h.sent();
                        onFailure &&
                            onFailure(this.getExecutingTask(updatedCurrentTask), err_1);
                        return [3 /*break*/, 6];
                    case 6:
                        done++;
                        if (!(done === total)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.tSortTasks()];
                    case 7:
                        _h.sent();
                        this.alreadyRunning = false;
                        this.run();
                        return [2 /*return*/];
                    case 8:
                        exec();
                        return [2 /*return*/];
                }
            });
        }); };
        while (done < upperLimit && !this.alreadyRunning) {
            this.alreadyRunning = true;
            exec();
        }
    };
    //Public members
    TaskQ.prototype.isTaskPending = function (task) {
        return (task === null || task === void 0 ? void 0 : task.state) === 'INIT' || (task === null || task === void 0 ? void 0 : task.state) === 'PROCESSING';
    };
    TaskQ.prototype.isTaskSuccessful = function (task) {
        return (task === null || task === void 0 ? void 0 : task.state) === 'SUCCESS';
    };
    TaskQ.prototype.isTaskFailed = function (task) {
        return (task === null || task === void 0 ? void 0 : task.state) === 'FAILURE';
    };
    TaskQ.prototype.addTask = function (task, characteristics) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, globalCharacteristics, newCharacteristics, tasks, generatedTaskId;
            return __generator(this, function (_b) {
                _a = this.globalConfigs.characteristics, globalCharacteristics = _a === void 0 ? {} : _a;
                newCharacteristics = __assign(__assign({}, globalCharacteristics), characteristics);
                tasks = Object.values(this.tasks);
                if (tasks.length > 5000)
                    throw new Error('Max task limit exceeded');
                generatedTaskId = this.generateTaskID();
                this.addInTasks(__assign(__assign({}, task), { key: generatedTaskId, state: 'INIT', characteristics: __assign(__assign({}, newCharacteristics), { failedAttempts: 0, addedAt: Date.now(), lastSuccessResponse: null, lastFailureResponse: null }) }));
                return [2 /*return*/, generatedTaskId];
            });
        });
    };
    TaskQ.prototype.searchTask = function (args) {
        var filter = args.filter, sortBy = args.sortBy;
        var tasks = Object.values(this.tasks);
        if (sortBy) {
            tasks = tasks.sort(function (a, b) {
                var _a, _b, _c, _d, _e, _f;
                if (!((_a = a.characteristics) === null || _a === void 0 ? void 0 : _a.addedAt) || !((_b = b.characteristics) === null || _b === void 0 ? void 0 : _b.addedAt))
                    return 0;
                switch (sortBy) {
                    case 'earliest':
                        return ((_c = a.characteristics) === null || _c === void 0 ? void 0 : _c.addedAt) - ((_d = b.characteristics) === null || _d === void 0 ? void 0 : _d.addedAt);
                    case 'latest':
                        return ((_e = b.characteristics) === null || _e === void 0 ? void 0 : _e.addedAt) - ((_f = a.characteristics) === null || _f === void 0 ? void 0 : _f.addedAt);
                    default:
                        return 0;
                }
            });
        }
        if (filter)
            tasks = tasks.filter(filter);
        return tasks;
    };
    TaskQ.prototype.getNetWorkState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, networkConfig, isOnline;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.globalConfigs.networkConfig, networkConfig = _a === void 0 ? {} : _a;
                        return [4 /*yield*/, (0, detectNetworkConnectivity_1.default)(networkConfig)];
                    case 1:
                        isOnline = _b.sent();
                        return [2 /*return*/, isOnline];
                }
            });
        });
    };
    TaskQ.prototype.forceStart = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.alreadyRunning)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.tSortTasks()];
                    case 1:
                        _a.sent();
                        this.run();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskQ.prototype.cleanup = function (args) {
        var _this = this;
        var shouldClean = args.shouldClean;
        var storage = this.globalConfigs.storage;
        if (shouldClean) {
            var successfulTasks_1 = [];
            var updatedTasks = Object.keys(this.tasks).reduce(function (acc, curr) {
                var _a;
                var _task = _this.tasks[curr];
                if (shouldClean(_task)) {
                    successfulTasks_1 = __spreadArray(__spreadArray([], successfulTasks_1, true), [_task], false);
                    return acc;
                }
                return __assign(__assign({}, acc), (_a = {}, _a[_task.key] = _task, _a));
            }, {});
            this.tasks = updatedTasks;
            if (storage) {
                storage.deleteBulk(successfulTasks_1.map(function (t) { return t.key; }));
            }
            return;
        }
        this.tasks = {};
        storage && storage.deleteAll();
    };
    return TaskQ;
}());
exports.default = TaskQ;
//# sourceMappingURL=TaskQ.js.map