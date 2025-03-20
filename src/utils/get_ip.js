"use strict";
/*
 * @Author: maple
 * @Date: 2020-09-22 02:39:31
 * @LastEditors: maple
 * @LastEditTime: 2021-03-18 18:17:45
 */
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
const fetchLocalIP = function ipme() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, request_promise_1.default)('https://icanhazip.com/');
    });
};
exports.default = fetchLocalIP;
