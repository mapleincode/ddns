/**
 * @Author: maple
 * @Date: 2020-09-22 02:39:31
 * @LastEditors: maple
 * @LastEditTime: 2020-09-22 09:50:38
 */
'use strict';

const Domain = require('../Domain');
const util = require('util');
const config = require('../config');

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

for (const func of config.DomainFunc) {
  AsyncDomain.prototype[`${func}Async`] = util.promisify(AsyncDomain.prototype[func]);
}

module.exports = AsyncDomain;
