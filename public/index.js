"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealmInterface = void 0;
var TaskQ_1 = __importDefault(require("./TaskQ"));
var realmInterface_1 = __importDefault(require("./storage/realmInterface"));
exports.RealmInterface = realmInterface_1.default;
exports.default = TaskQ_1.default;
//# sourceMappingURL=index.js.map