"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import RealmInterface from './storage/realmInterface';
var TaskQ_1 = __importDefault(require("./TaskQ"));
var shouldExecuteGeneral = function (_a) {
    var task = _a.task;
    var _b = task.characteristics, characteristics = _b === void 0 ? {} : _b;
    if (characteristics.failedAttempts &&
        characteristics.failedAttempts > 3 &&
        ['FAILURE'].includes(task.state))
        return false;
    return true;
};
var dummyExecute = function () {
    return new Promise(function (res, rej) {
        var randomDelay = Math.ceil(Math.random() * 5000);
        var shouldResolve = Math.floor(Math.random() * 2);
        setTimeout(function () {
            !!shouldResolve ? res('Resolved') : rej('Rejected');
        }, randomDelay);
    });
};
var testMock = function () {
    var instance = TaskQ_1.default.initialiseTaskQ({
        // storage: new RealmInterface(),
        characteristics: {
            serverEndpoint: 'https://jeeves.flipkart.com',
        },
        networkConfig: {
            pingServerUrl: 'https://jeeves.flipkart.com/health_check',
            customHeaders: {
                'X-AUTH-TOKEN': 'bf1a832e35d680f7fe731106b8c507c82d35affd',
                USERNAME: 'DUMMY_123',
            },
        },
        keepSuccessResponse: true,
        concurrancyDemanded: 5,
        shouldExecute: shouldExecuteGeneral,
        doExecute: dummyExecute,
        onSuccess: function (task) {
            console.log("TASK ".concat(task.key, " SUCCESSFULL..."));
        },
        onFailure: function (task) {
            console.log("TASK ".concat(task.key, " FAILED..."));
        },
    });
    var addTask = function (key, taskType, dependentTaskKeys, taskGraphId) {
        if (taskGraphId === void 0) { taskGraphId = ''; }
        return __awaiter(void 0, void 0, void 0, function () {
            var addedTaskKey;
            return __generator(this, function (_a) {
                addedTaskKey = instance.addTask({
                    dependentTaskKeys: dependentTaskKeys,
                }, {
                    data: {
                        key: key,
                        taskGraphId: taskGraphId,
                        taskType: taskType,
                    },
                });
                return [2 /*return*/, addedTaskKey];
            });
        });
    };
    var travelTaskId = '';
    var barcodeTaskId = '';
    var image1TaskId = '';
    var image2TaskId = '';
    var image3TaskId = '';
    var image4TaskId = '';
    var image5TaskId = '';
    var uploadImageTaskId = '';
    var copTaskId = '';
    var signatureTaskId = '';
    var terminalTaskId = '';
    var updateTravelTask = function (taskGraphId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addTask("Travel", 'Travel', [], taskGraphId)];
                case 1:
                    travelTaskId = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var updateScanBarCodeTask = function (taskGraphId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addTask("ScanBarcode", 'ScanBarCode', [travelTaskId], taskGraphId)];
                case 1:
                    barcodeTaskId = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var uploadImageTask1 = function (taskGraphId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Barcode task ID', barcodeTaskId);
                    return [4 /*yield*/, addTask("UploadMedia1", 'UploadMedia', [barcodeTaskId], taskGraphId)];
                case 1:
                    image1TaskId = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var uploadImageTask2 = function (taskGraphId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addTask("UploadMedia2", 'UploadMedia', [barcodeTaskId], taskGraphId)];
                case 1:
                    image2TaskId = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var uploadImageTask3 = function (taskGraphId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addTask("UploadMedia3", 'UploadMedia', [barcodeTaskId], taskGraphId)];
                case 1:
                    image3TaskId = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var uploadImageTask4 = function (taskGraphId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addTask("UploadMedia4", 'UploadMedia', [barcodeTaskId], taskGraphId)];
                case 1:
                    image4TaskId = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var uploadImageTask5 = function (taskGraphId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addTask("UploadMedia5", 'UploadMedia', [barcodeTaskId], taskGraphId)];
                case 1:
                    image5TaskId = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var updateUploadImageTask = function (taskGraphId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addTask("UploadImage", 'UploadImage', [barcodeTaskId], taskGraphId)];
                case 1:
                    uploadImageTaskId = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var updateCOPTask = function (taskGraphId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addTask("COP", 'COP', [uploadImageTaskId], taskGraphId)];
                case 1:
                    copTaskId = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var updateSignatureTask = function (taskGraphId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addTask("Signature", 'Signature', [copTaskId], taskGraphId)];
                case 1:
                    signatureTaskId = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var updateTerminalTask = function (taskGraphId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addTask("Terminal", 'Terminal', [
                        signatureTaskId,
                        image1TaskId,
                        image2TaskId,
                        image3TaskId,
                        image4TaskId,
                        image5TaskId,
                    ], taskGraphId)];
                case 1:
                    terminalTaskId = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var testOrderedTasks = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, updateTravelTask('GRAPH1')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, updateScanBarCodeTask('GRAPH1')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, uploadImageTask1('GRAPH1')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, uploadImageTask2('GRAPH1')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, uploadImageTask4('GRAPH1')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, uploadImageTask3('GRAPH1')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, uploadImageTask5('GRAPH1')];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, updateUploadImageTask('GRAPH1')];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, updateCOPTask('GRAPH1')];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, updateSignatureTask('GRAPH1')];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, updateTerminalTask('GRAPH1')];
                case 11:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var testJumbledTasks = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, updateScanBarCodeTask('GRAPH1')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, updateTravelTask('GRAPH1')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, uploadImageTask1('GRAPH1')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, uploadImageTask2('GRAPH1')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, updateSignatureTask('GRAPH1')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, uploadImageTask4('GRAPH1')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, uploadImageTask3('GRAPH1')];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, updateCOPTask('GRAPH1')];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, uploadImageTask5('GRAPH1')];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, updateUploadImageTask('GRAPH1')];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, updateTerminalTask('GRAPH1')];
                case 11:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var testNotDependentTask = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addTask("TaskId-Travel-GRAPH1", 'Travel', [])];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, addTask("TaskId-Travel-GRAPH2", 'Travel', [])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, addTask("TaskId-Travel-GRAPH3", 'Travel', [])];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, addTask("TaskId-Travel-GRAPH4", 'Travel', [])];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, addTask("TaskId-Travel-GRAPH5", 'Travel', [])];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, addTask("TaskId-Travel-GRAPH6", 'Travel', [])];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, addTask("TaskId-Travel-GRAPH7", 'Travel', [])];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, addTask("TaskId-Travel-GRAPH8", 'Travel', [])];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, addTask("TaskId-Travel-GRAPH9", 'Travel', [])];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, addTask("TaskId-Travel-GRAPH10", 'Travel', [])];
                case 10:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var testDeadlock = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addTask("TaskId-Travel-GRAPH1", 'Travel', [])];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, addTask("TaskId-Travel-GRAPH2", 'Travel', [])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, addTask("TaskId-Travel-GRAPH3", 'Travel', [])];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, addTask("TaskId-Travel-GRAPH4", 'Travel', [])];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, addTask("TaskId-Travel-GRAPH5", 'Travel', [])];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, addTask("TaskId-Travel-GRAPH6", 'Travel', [])];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, addTask("TaskId-Travel-GRAPH7", 'Travel', [])];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, addTask("TaskId-Travel-GRAPH8", 'Travel', [])];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, addTask("TaskId-Travel-GRAPH9", 'Travel', ['TaskId-Travel-GRAPH10'])];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, addTask("TaskId-Travel-GRAPH10", 'Travel', ['TaskId-Travel-GRAPH9'])];
                case 10:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var delay = function () {
        return new Promise(function (res) {
            setTimeout(function () { return res(true); }, 1000);
        });
    };
    var searchTask = function () {
        instance.searchTask({
            filter: function (task) { return task.state === 'SUCCESS'; },
        });
    };
    // testNotDependentTask();
    testOrderedTasks();
    // testJumbledTasks();
    // testDeadlock();
};
exports.default = testMock;
//# sourceMappingURL=SampleConsumer.js.map