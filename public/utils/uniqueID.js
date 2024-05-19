"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomId = void 0;
exports.getRandomId = (function uniqueIdSingleton() {
    var count = Math.floor(Math.random() * 10000000000);
    return function incrementer(id) {
        if (id === void 0) { id = ''; }
        return id + count++;
    };
})();
//# sourceMappingURL=uniqueID.js.map