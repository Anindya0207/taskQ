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
exports.headers = void 0;
var constants_1 = require("./constants");
exports.headers = {
    'Cache-Control': constants_1.CACHE_HEADER_VALUE,
    Pragma: 'no-cache',
    Expires: '0',
};
function makeHttpRequest(args) {
    var _a = args.method, method = _a === void 0 ? constants_1.DEFAULT_HTTP_METHOD : _a, _b = args.url, url = _b === void 0 ? constants_1.DEFAULT_PING_SERVER_URL : _b, _c = args.timeout, timeout = _c === void 0 ? constants_1.DEFAULT_TIMEOUT : _c, _d = args.customHeaders, customHeaders = _d === void 0 ? constants_1.DEFAULT_CUSTOM_HEADERS : _d, testMethod = args.testMethod;
    return new Promise(function (resolve, reject) {
        // @ts-ignore
        var xhr = new XMLHttpRequest(testMethod);
        xhr.open(method, url);
        xhr.timeout = timeout;
        xhr.onload = function onLoad() {
            // 3xx is a valid response for us, since the server was reachable
            if (this.status >= 200 && this.status < 400) {
                resolve({
                    status: this.status,
                });
            }
            else {
                reject({
                    status: this.status,
                });
            }
        };
        xhr.onerror = function onError() {
            reject({
                status: this.status,
            });
        };
        xhr.ontimeout = function onTimeOut() {
            reject({
                status: this.status,
            });
        };
        var combinedHeaders = __assign(__assign({}, exports.headers), customHeaders);
        Object.keys(combinedHeaders).forEach(function (key) {
            var k = key;
            xhr.setRequestHeader(k, combinedHeaders[k]);
        });
        xhr.send(null);
    });
}
exports.default = makeHttpRequest;
//# sourceMappingURL=makeHttpRequest.js.map