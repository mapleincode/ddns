'use strict';

const SubDomain = require('../SubDomain');
const util = require('util');

class SubDomainAsync extends SubDomain {
    constructor() {
        super(...arguments);
    }
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

for(const func of funcList) {
    SubDomainAsync.prototype[`${func}Async`] = util.promisify(SubDomainAsync.prototype[func]);
}

module.exports = SubDomainAsync;
