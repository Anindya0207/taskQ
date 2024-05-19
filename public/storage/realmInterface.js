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
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var RealmInterface = /** @class */ (function () {
    function RealmInterface(_realm) {
        var taskSchema = {
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
    RealmInterface.initialiseRealm = function (conf) {
        return __awaiter(this, void 0, void 0, function () {
            var _realmInstance, encryptionKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _realmInstance = new RealmInterface(conf.realm);
                        encryptionKey = '';
                        if (!conf.getEncryptionKey) return [3 /*break*/, 2];
                        return [4 /*yield*/, conf.getEncryptionKey(this.dbFileName)];
                    case 1:
                        encryptionKey = _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, _realmInstance.openRealm(encryptionKey)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, _realmInstance];
                }
            });
        });
    };
    RealmInterface.prototype.openRealm = function (_encryptionKey) {
        return __awaiter(this, void 0, void 0, function () {
            var schema, conf, exists, _a, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        schema = this.config.schema;
                        if (!schema) return [3 /*break*/, 7];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 6]);
                        conf = __assign({ path: RealmInterface.dbFileName, schema: [schema] }, (_encryptionKey && {
                            encryptionKey: (0, utils_1.convertToByteArray)(_encryptionKey),
                        }));
                        exists = this.realmLib.exists(conf);
                        if (!exists) return [3 /*break*/, 3];
                        _a = this;
                        return [4 /*yield*/, this.realmLib.open(conf)];
                    case 2:
                        _a.realm = _b.sent();
                        console.log('[TASKQ]: Realm exists');
                        return [3 /*break*/, 4];
                    case 3:
                        this.realm = new this.realmLib(conf);
                        console.log('[TASKQ]: Realm does not exist');
                        _b.label = 4;
                    case 4:
                        console.log('[TASKQ]: Realm init', this.realm);
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _b.sent();
                        console.log('[TASKQ]: Error opening realm', err_1);
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 8];
                    case 7: throw new Error('Please pass a schema');
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    RealmInterface.prototype.add = function (task) {
        var _this = this;
        var schema = this.config.schema;
        if (!this.realm || !schema) {
            throw new Error('Realm is not initialised');
        }
        var dbTask = {
            key: task.key,
            state: task.state,
            characteristics: JSON.stringify(task.characteristics || {}),
            dependentTaskKeys: JSON.stringify(task.dependentTaskKeys || []),
        };
        this.realm.write(function () {
            _this.realm.create(schema.name, dbTask, _this.realmLib.UpdateMode.All);
        });
    };
    RealmInterface.prototype.getAll = function () {
        var schema = this.config.schema;
        if (!this.realm || !schema) {
            throw new Error('Realm is not initialised');
        }
        var allObjects = this.realm.objects(schema.name).toJSON();
        return allObjects.reduce(function (acc, curr) {
            var _a;
            return (__assign(__assign({}, acc), (_a = {}, _a[curr.key] = {
                key: curr.key,
                state: curr.state,
                characteristics: JSON.parse(curr.characteristics),
                dependentTaskKeys: JSON.parse(curr.dependentTaskKeys),
            }, _a)));
        }, {});
    };
    RealmInterface.prototype.search = function (key) {
        var _a;
        var schema = this.config.schema;
        if (!this.realm || !schema) {
            throw new Error('Realm is not initialised');
        }
        var searchedObject = (_a = this.realm
            .objectForPrimaryKey(schema.name, key)) === null || _a === void 0 ? void 0 : _a.toJSON();
        return {
            key: searchedObject === null || searchedObject === void 0 ? void 0 : searchedObject.key,
            state: searchedObject === null || searchedObject === void 0 ? void 0 : searchedObject.state,
            characteristics: JSON.parse(searchedObject === null || searchedObject === void 0 ? void 0 : searchedObject.characteristics),
            dependentTaskKeys: JSON.parse(searchedObject === null || searchedObject === void 0 ? void 0 : searchedObject.dependentTaskKeys),
        };
    };
    RealmInterface.prototype.edit = function (_a) {
        var _this = this;
        var key = _a.key, task = _a.task;
        var schema = this.config.schema;
        if (!this.realm || !schema) {
            throw new Error('Realm is not initialised');
        }
        var objectToUpdate = this.realm.objectForPrimaryKey(schema.name, key);
        var dbTask = {
            key: task.key,
            state: task.state,
            characteristics: JSON.stringify(task.characteristics || {}),
            dependentTaskKeys: JSON.stringify(task.dependentTaskKeys || []),
        };
        this.realm.write(function () {
            if (objectToUpdate) {
                _this.realm.create(schema.name, dbTask, _this.realmLib.UpdateMode.Modified);
            }
        });
    };
    RealmInterface.prototype.delete = function (key) {
        var _this = this;
        var schema = this.config.schema;
        if (!this.realm || !schema) {
            throw new Error('Realm is not initialised');
        }
        var objectToDelete = this.realm.objectForPrimaryKey(schema.name, key);
        this.realm.write(function () {
            if (objectToDelete) {
                _this.realm.delete(objectToDelete);
            }
        });
    };
    RealmInterface.prototype.deleteBulk = function (keys) {
        var _this = this;
        var schema = this.config.schema;
        if (!this.realm || !schema) {
            throw new Error('Realm is not initialised');
        }
        this.realm.write(function () {
            keys.forEach(function (key) {
                var objectToDelete = _this.realm.objectForPrimaryKey(schema.name, key);
                if (objectToDelete) {
                    _this.realm.delete(objectToDelete);
                }
            });
        });
    };
    RealmInterface.prototype.deleteAll = function () {
        var _this = this;
        var schema = this.config.schema;
        if (!this.realm || !schema) {
            throw new Error('Realm is not initialised');
        }
        this.realm.write(function () {
            _this.realm.deleteAll();
        });
    };
    RealmInterface.dbFileName = 'taskQ.realm';
    return RealmInterface;
}());
exports.default = RealmInterface;
//# sourceMappingURL=realmInterface.js.map