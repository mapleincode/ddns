"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorFormat = exports.getIP = void 0;
/**
 * @Author: maple
 * @Date: 2021-03-15 21:30:08
 * @LastEditors: maple
 * @LastEditTime: 2021-03-15 22:08:05
 */
const get_ip_1 = __importDefault(require("./get_ip"));
const error_format_1 = __importDefault(require("./error_format"));
exports.getIP = get_ip_1.default;
exports.errorFormat = error_format_1.default;
