"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: maple
 * @Date: 2020-09-22 09:25:53
 * @LastEditors: maple
 * @LastEditTime: 2021-10-22 16:14:20
 */
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fsPromise = fs_1.default.promises;
/**
 * Created by maple on 2018/1/10.
 */
const ErrorMap = {};
const errorFormat = function (errorPath, errorCode, errorMessage) {
    const subPath = errorPath.slice(1).toLowerCase();
    let mmp;
    if (ErrorMap[subPath] !== undefined) {
        mmp = ErrorMap[errorPath];
    }
    else {
        const json = fs_1.default.readFileSync(path_1.default.join(__dirname, `../../errors${errorPath}.json`), { encoding: 'utf-8' });
        mmp = JSON.parse(json);
        ErrorMap[errorPath] = mmp;
    }
    let errorMsg = mmp[errorCode.toString()];
    if (errorMsg === undefined) {
        errorMsg = `未知错误。code: ${errorCode} message: ${errorMessage}`;
    }
    else {
        errorMsg = `${errorMsg}。code: ${errorCode} message: ${errorMessage}`;
    }
    return new Error(errorMsg);
};
exports.default = errorFormat;
