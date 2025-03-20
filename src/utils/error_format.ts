/*
 * @Author: maple
 * @Date: 2020-09-22 09:25:53
 * @LastEditors: maple
 * @LastEditTime: 2025-03-20 15:04:52
 */
import fs from "fs";
import path from "path";
import { ErrorFormatFunction, StringToErrorMap } from "../type/other.type";

const fsPromise = fs.promises;

/**
 * Created by maple on 2018/1/10.
 */
const ErrorMap: { [key: string]: StringToErrorMap } = {};

const errorFormat: ErrorFormatFunction = function (errorPath: string, errorCode: string, errorMessage: string): Error {
    const subPath = errorPath.slice(1).toLowerCase();
    let mmp: StringToErrorMap;

    if (ErrorMap[subPath] !== undefined) {
        mmp = ErrorMap[subPath];
    } else {
        try {
            const json = fs.readFileSync(path.join(__dirname, `../../errors/${subPath}.json`), { encoding: 'utf-8'});
            mmp = JSON.parse(json);
        } catch(ignore) {
            mmp = {};
        }
        ErrorMap[subPath] = mmp;
    }

    let errorMsg = mmp[errorCode.toString()];
    if (errorMsg === undefined) {
        errorMsg = `未知错误。code: ${errorCode} message: ${errorMessage}`;
    } else {
        errorMsg = `${errorMsg}。code: ${errorCode} message: ${errorMessage}`
    }
    return new Error(errorMsg);
}

export default errorFormat;
