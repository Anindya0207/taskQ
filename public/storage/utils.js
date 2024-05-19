"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToByteArray = void 0;
var convertToByteArray = function (str) {
    var rawLength = str.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
    for (var i = 0; i < rawLength; i++) {
        array[i] = str.charCodeAt(i);
    }
    return array;
};
exports.convertToByteArray = convertToByteArray;
//# sourceMappingURL=utils.js.map