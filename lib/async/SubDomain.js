/**
 * @Author: maple
 * @Date: 2020-09-19 11:10:10
 * @LastEditors: maple
 * @LastEditTime: 2020-09-22 02:41:11
 */
'use strict';

const SubDomain = require('../SubDomain');
const util = require('util');

class SubDomainAsync extends SubDomain {
}

const funcList = [
  'initByAPI',
  'update',
  'setDns',
  'ddns',
  'setRemark',
  'setStatus',
  'remove'
];

for (const func of funcList) {
  SubDomainAsync.prototype[`${func}Async`] = util.promisify(SubDomainAsync.prototype[func]);
}

module.exports = SubDomainAsync;
