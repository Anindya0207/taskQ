"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var reducers_1 = __importDefault(require("./reducers"));
function createReduxStore(_a) {
    var rootReducer = (0, redux_1.combineReducers)(reducers_1.default);
    var store = (0, redux_1.createStore)(rootReducer, []);
    return store;
}
exports.default = createReduxStore;
//# sourceMappingURL=createStore.js.map