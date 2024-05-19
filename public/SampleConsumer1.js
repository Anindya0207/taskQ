"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
        var randomDelay = Math.ceil(Math.random() * 10000);
        var shouldResolve = Math.floor(Math.random() * 2);
        setTimeout(function () {
            !!shouldResolve ? res('Resolved') : rej('Rejected');
        }, randomDelay);
    });
};
var testMock = function () {
    var instance = TaskQ_1.default.initialiseTaskQ({
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
    var addTask = function (key, taskType, dependentTaskKeys, taskGraphId, shouldExecute, doExecute) {
        if (taskGraphId === void 0) { taskGraphId = ''; }
        if (shouldExecute === void 0) { shouldExecute = shouldExecuteGeneral; }
        if (doExecute === void 0) { doExecute = dummyExecute; }
        instance.addTask({
            dependentTaskKeys: dependentTaskKeys,
        }, {
            data: {
                taskGraphId: taskGraphId,
                taskType: taskType,
            },
        });
    };
    var updateTravelTask = function (taskGraphId) {
        addTask("TaskId-Travel-".concat(taskGraphId), 'Travel', [], taskGraphId);
    };
    var updateScanBarCodeTask = function (taskGraphId) {
        addTask("TaskId-ScanBarcode-".concat(taskGraphId), 'ScanBarCode', ["TaskId-Travel-".concat(taskGraphId)], taskGraphId);
    };
    var uploadImageTask1 = function (taskGraphId) {
        addTask("TaskId-UploadMedia1-".concat(taskGraphId), 'UploadMedia', ["TaskId-ScanBarcode-".concat(taskGraphId)], taskGraphId);
    };
    var uploadImageTask2 = function (taskGraphId) {
        addTask("TaskId-UploadMedia2-".concat(taskGraphId), 'UploadMedia', ["TaskId-ScanBarcode-".concat(taskGraphId)], taskGraphId);
    };
    var uploadImageTask3 = function (taskGraphId) {
        addTask("TaskId-UploadMedia3-".concat(taskGraphId), 'UploadMedia', ["TaskId-ScanBarcode-".concat(taskGraphId)], taskGraphId);
    };
    var uploadImageTask4 = function (taskGraphId) {
        addTask("TaskId-UploadMedia4-".concat(taskGraphId), 'UploadMedia', ["TaskId-ScanBarcode-".concat(taskGraphId)], taskGraphId);
    };
    var uploadImageTask5 = function (taskGraphId) {
        addTask("TaskId-UploadMedia5-".concat(taskGraphId), 'UploadMedia', ["TaskId-ScanBarcode-".concat(taskGraphId)], taskGraphId);
    };
    var updateUploadImageTask = function (taskGraphId) {
        addTask("TaskId-UploadImage-".concat(taskGraphId), 'UploadImage', ["TaskId-ScanBarcode-".concat(taskGraphId)], taskGraphId);
    };
    var updateCOPTask = function (taskGraphId) {
        addTask("TaskId-COP-".concat(taskGraphId), 'COP', ["TaskId-UploadImage-".concat(taskGraphId)], taskGraphId);
    };
    var updateSignatureTask = function (taskGraphId) {
        addTask("TaskId-Signature-".concat(taskGraphId), 'Signature', ["TaskId-COP-".concat(taskGraphId)], taskGraphId);
    };
    var updateTerminalTask = function (taskGraphId) {
        addTask("TaskId-Terminal-".concat(taskGraphId), 'Terminal', [
            "TaskId-Signature-".concat(taskGraphId),
            "TaskId-UploadMedia1-".concat(taskGraphId),
            "TaskId-UploadMedia2-".concat(taskGraphId),
            "TaskId-UploadMedia3-".concat(taskGraphId),
            "TaskId-UploadMedia4-".concat(taskGraphId),
            "TaskId-UploadMedia5-".concat(taskGraphId),
        ], taskGraphId);
    };
    var testOrderedTasks = function () {
        updateTravelTask('GRAPH1');
        updateScanBarCodeTask('GRAPH1');
        uploadImageTask1('GRAPH1');
        uploadImageTask2('GRAPH1');
        uploadImageTask4('GRAPH1');
        uploadImageTask3('GRAPH1');
        uploadImageTask5('GRAPH1');
        updateUploadImageTask('GRAPH1');
        updateSignatureTask('GRAPH1');
        updateCOPTask('GRAPH1');
        updateTerminalTask('GRAPH1');
    };
    var testJumbledTasks = function () {
        updateScanBarCodeTask('GRAPH1');
        updateTravelTask('GRAPH1');
        uploadImageTask1('GRAPH1');
        uploadImageTask2('GRAPH1');
        updateSignatureTask('GRAPH1');
        uploadImageTask4('GRAPH1');
        uploadImageTask3('GRAPH1');
        updateCOPTask('GRAPH1');
        uploadImageTask5('GRAPH1');
        updateUploadImageTask('GRAPH1');
        updateTerminalTask('GRAPH1');
    };
    var testNotDependentTask = function () {
        addTask("TaskId-Travel-GRAPH1", 'Travel', []);
        addTask("TaskId-Travel-GRAPH2", 'Travel', []);
        addTask("TaskId-Travel-GRAPH3", 'Travel', []);
        addTask("TaskId-Travel-GRAPH4", 'Travel', []);
        addTask("TaskId-Travel-GRAPH5", 'Travel', []);
        addTask("TaskId-Travel-GRAPH6", 'Travel', []);
        addTask("TaskId-Travel-GRAPH7", 'Travel', []);
        addTask("TaskId-Travel-GRAPH8", 'Travel', []);
        addTask("TaskId-Travel-GRAPH9", 'Travel', []);
        addTask("TaskId-Travel-GRAPH10", 'Travel', []);
    };
    var testDeadlock = function () {
        addTask("TaskId-Travel-GRAPH1", 'Travel', []);
        addTask("TaskId-Travel-GRAPH2", 'Travel', []);
        addTask("TaskId-Travel-GRAPH3", 'Travel', []);
        addTask("TaskId-Travel-GRAPH4", 'Travel', []);
        addTask("TaskId-Travel-GRAPH5", 'Travel', []);
        addTask("TaskId-Travel-GRAPH6", 'Travel', []);
        addTask("TaskId-Travel-GRAPH7", 'Travel', []);
        addTask("TaskId-Travel-GRAPH8", 'Travel', []);
        addTask("TaskId-Travel-GRAPH9", 'Travel', ['TaskId-Travel-GRAPH10']);
        addTask("TaskId-Travel-GRAPH10", 'Travel', ['TaskId-Travel-GRAPH9']);
    };
    var delay = function () {
        return new Promise(function (res) {
            setTimeout(function () { return res(true); }, 1000);
        });
    };
    // testNotDependentTask();
    testOrderedTasks();
    // testJumbledTasks();
    // testDeadlock();
};
exports.default = testMock;
//# sourceMappingURL=SampleConsumer1.js.map