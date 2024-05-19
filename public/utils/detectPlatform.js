"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var detectPlatform = function () {
    if (!(navigator === null || navigator === void 0 ? void 0 : navigator.userAgent))
        return 'MOBILE';
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return 'MOBILE_BROWSER';
    }
    return 'WEB_BROWSER';
};
exports.default = detectPlatform;
//# sourceMappingURL=detectPlatform.js.map