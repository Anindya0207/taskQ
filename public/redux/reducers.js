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
Object.defineProperty(exports, "__esModule", { value: true });
var INITIAL_STATE = {
    tasks: {},
};
var tasksReducer = function (state, action) {
    var _a;
    if (state === void 0) { state = INITIAL_STATE; }
    if (action.type === 'ADD_UPDATE_TASK') {
        var newTask = action.payload.task;
        return __assign(__assign({}, state), (_a = {}, _a[newTask.key] = newTask, _a));
    }
    if (action.type === 'RESET_TASKS') {
        var newTasks = action.payload.tasks;
        return newTasks.reduce(function (acc, curr) {
            var _a;
            return (__assign(__assign({}, acc), (_a = {}, _a[curr.key] = curr, _a)));
        }, {});
    }
    return state;
};
exports.default = tasksReducer;
//# sourceMappingURL=reducers.js.map