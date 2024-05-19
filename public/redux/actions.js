"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetTasks = exports.addTask = void 0;
var getUUID = function () { return new Date().getUTCMilliseconds(); };
var addTask = function (task) { return ({
    type: 'ADD_TASK',
    payload: {
        task: task,
    },
}); };
exports.addTask = addTask;
var resetTasks = function (tasks) { return ({
    type: 'RESET_TASKS',
    payload: {
        tasks: tasks,
    },
}); };
exports.resetTasks = resetTasks;
//# sourceMappingURL=actions.js.map