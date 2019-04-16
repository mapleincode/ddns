/**
 * Created by maple on 2018/1/10.
 */

'use strict';

const ErrorMap = {};

module.exports = function(path, errorCode, errorMessage) {
    path = path.slice(1).toLowerCase();
    let mmp;
    if(ErrorMap[path]) {
        mmp = ErrorMap[path];
    }
    mmp = require(`./errors/${path}`);
    ErrorMap[path] = mmp;
    let errorMsg = mmp[errorCode];
    if(!errorMsg) {
        errorMsg = `未知错误 code: ${errorCode} errorMsg: ${errorMessage}`;
    }
    return new Error(errorMsg);
};
