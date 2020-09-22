/**
 * @Author: maple
 * @Date: 2020-09-19 11:10:10
 * @LastEditors: maple
 * @LastEditTime: 2020-09-22 09:42:06
 */
'use strict';

const SubDomain = require('../SubDomain');
const util = require('util');
const config = require('../config');

class SubDomainAsync extends SubDomain {
}

for (const func of config.SubDomainFunc) {
  SubDomainAsync.prototype[`${func}Async`] = util.promisify(SubDomainAsync.prototype[func]);
}

module.exports = SubDomainAsync;
