'use strict';

const Domain = require('../Domain');
const util = require('util');

const funcList = [
    'recordList',
    'recordByName',
    'recordById',
    'recordByKeyword',
    'createRecord',
    'updateRecord',
    'updateRecordByName',
    'removeRecord',
    'ddns',
    'remark',
    'setStatus'
];

class DomainAsync extends Domain {
    constructor() {
        super(...arguments);
        this.SubDomain = require('./SubDomain');
    }

    get getIPAsync() {
        return util.promisify(this._func.getIP);
    }

    set getIPAsync(func) {
        this.getIP = func;
    }
}

for(const func of funcList) {
    DomainAsync.prototype[`${func}Async`] = util.promisify(DomainAsync.prototype[func]);
}

module.exports = DomainAsync;