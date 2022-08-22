/*
 * @Author: maple
 * @Date: 2020-09-22 09:25:53
 * @LastEditors: maple
 * @LastEditTime: 2021-10-22 16:14:20
 */
/**
 * Created by maple on 2018/1/10.
 */
const ErrorMap: { [key: string]: ErrorData } = {};

function errorFormat (path: string, errorCode: string, errorMessage: string): Error {
    const subPath = path.slice(1).toLowerCase();
    let mmp: ErrorData;

    if (ErrorMap[subPath] !== undefined) {
        mmp = ErrorMap[path];
    } else {
        mmp = require(`../../errors${path}.json`);
        ErrorMap[path] = mmp;
    }

    let errorMsg = mmp[errorCode.toString()];
    if (errorMsg === undefined) {
        errorMsg = `未知错误 code: ${errorCode} errorMsg: ${errorMessage}`;
    }
    return new Error(errorMsg);
}

export default errorFormat;
