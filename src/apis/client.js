"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_1 = __importDefault(require("request-promise"));
const utils_1 = require("../utils");
class DNSPodClient {
    constructor(loginToken, options) {
        this.loginToken = loginToken;
        this.ext = options === null || options === void 0 ? void 0 : options.ext;
        if (options === null || options === void 0 ? void 0 : options.serverHost) {
            this.serverHost = options.serverHost;
        }
        else {
            this.serverHost = 'https://dnsapi.cn';
        }
        if (options === null || options === void 0 ? void 0 : options.customErrorFormat) {
            this.errorFormat = options.customErrorFormat;
        }
        else {
            this.errorFormat = utils_1.errorFormat;
        }
    }
    request(apiPath, json) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestData = Object.assign(Object.assign(Object.assign({}, this.ext), json), { login_token: this.loginToken, format: 'json' });
            const requestParams = {
                method: 'POST',
                form: requestData,
                json: true,
                uri: `${this.serverHost}${apiPath}`
            };
            const body = yield (0, request_promise_1.default)(requestParams);
            const status = body.status;
            if (status.code !== '1') {
                throw (0, utils_1.errorFormat)(apiPath, status.code, status.message);
            }
            console.log(requestData);
            console.log(JSON.stringify(body) + "\n\n\n");
            return body;
        });
    }
}
exports.default = DNSPodClient;
