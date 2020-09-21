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

class AsyncDomain extends Domain {
  constructor () {
    super(...arguments);
    this.SubDomain = require('./SubDomain');
  }

  get getIPAsync () {
    return util.promisify(this._func.getIP);
  }

  set getIPAsync (func) {
    this.getIP = func;
  }
}

for (const func of funcList) {
  AsyncDomain.prototype[`${func}Async`] = util.promisify(AsyncDomain.prototype[func]);
}

module.exports = AsyncDomain;
