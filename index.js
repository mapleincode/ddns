/**
 * Created by maple on 2018/1/10.
 */
'use strict';

const _ = require('lodash');
const request = require('request');

const getIP = require('./lib/getIP');
const getError = require('./lib/getError');

const SubDomain = require('./lib/subDomain');


class Domain {
    constructor(email, password, domainName, options) {
        this.getIP = getIP;
        this.getError = getError;
        options = options || {};

        this._account = {
            email,
            password,
            domainName,
            domainId: options.domainId
        };

        this._domain = {
            domainName
        };

        this.baseURI = 'https://dnsapi.cn'
    }

    _request(path, json, callback) {
        if(typeof json !== 'object') {
            json = {};
        }

        json['login_email'] = this._account.email;
        json['login_password'] = this._account.password;
        json.format = 'json';
        json['domain'] = this._domain.domainName;

        if(this._domain.domainId) {
            json['domain_id'] = this._domain.domainId;
        }

        const self = this;

        request.post({
            uri: this.baseURI + path,
            form: json,
            json: true
        }, function(err, resp, body) {
            if(err) {
                return callback(err);
            }
            if(!body) {
                return callback(new Error('API 返回 body 不存在!'));
            }
            const status = body.status;
            if(status.code !== '1') {
                const error = self.getError(path, status.code, status.message);
                return callback(error);
            }
            if(body.domain) {
                self._domain = _.assign(self._domain, body.domain);
            }
            if(body.info) {
                self._domainInfo = _.assign(self._domainInfo, body.info);
            }
            try {
                delete body.status;
                delete body.domain;
            } catch(ex) {

            }
            callback(undefined, body);
        });
    }

    recordList(offset, length, callback) {
        // 判断 offset 是否为 callback
        if(typeof offset === 'function') {
            callback = offset;
            offset = 0;
            length = 3000;
        }

        const path = '/Record.List';

        const self = this;
        this._request(path, {
            offset,
            length
        }, function(err, result) {
            if(err) {
                return callback(err);
            }
            const recordList = result.records.map(record => new SubDomain(record, self));
            callback(undefined, recordList);
        });
    }

    recordByName(subDomainName, callback, json) {
        const path = '/Record.List';
        const offset = 0;
        const length = 1;
        const self = this;
        this._request(path, {
            offset,
            length,
            sub_domain: subDomainName
        }, function(err, result) {
            if(err) {
                return callback(err);
            }

            if(json) {
                callback(undefined, result.records[0]);
            } else {
                callback(undefined, result.records.map(record => new SubDomain(record, self))[0]);
            }
        });

    }

    recordById(recordId, callback, json) {
            const path = '/Record.Info';

            const self = this;

            this._request(path, {
                record_id: recordId
            }, function(err, body) {
                if(err) {
                    return callback(err);
                }
                if(!body.record) {
                    return callback(undefined, null);
                }
                return callback(undefined, new SubDomain(body.record, self));
            });
        }

    recordByKeyword(keyword, offset, length, callback) {
        if(typeof offset === 'function') {
            callback = offset;
            offset = 0;
            length = 3000;
        }
        const path = '/Record.List';
        const self = this;
        this._request(path, {
            offset,
            length,
            keyword: keyword
        }, function(err, result) {
            if(err) {
                return callback(err);
            }
            const recordList = result.records.map(record => new SubDomain(record, self));
            callback(undefined, recordList);
        });
    }

    setGetIPFunction(func) {
        if(typeof func !== 'function') {
            throw new Error('error get ip function!');
        }
        this.getIP = func;
    }

    createRecord(subDomain, recordType, value, options, callback) {
        const path = '/Record.Create';

        subDomain = subDomain || '@';

        if(typeof options === 'function') {
            callback = options;
            options = {};
        }

        recordType = recordType.toUpperCase();
        if(recordType === 'MX') {
            if(!options.mx) {
                return callback(new Error('options.mx must be get on MX record'));
            }
        }

        const json = {
            sub_domain: subDomain,
            record_type: recordType,
            value: value,
            mx: options.mx,
            record_line: options.recordLine || '默认',
            record_line_id: options.recordLineId,
            ttl: options.ttl,
            status: options.status,
            weight: options.weight
        };
        const self = this;
        self._request(path, json, function(err, body) {
            if(err) {
                return callback(err);
            }

            const subD = new SubDomain(body.record, self);

            subD.initByAPI(function(err) {
                if(err) {
                    return callback(err);
                }
                callback(undefined, subD);
            });
        });

    }

    updateRecord(recordId, subDomain, recordType, value, options, callback) {
        const path = '/Record.Modify';

        if(typeof options === 'function') {
            callback = options;
            options = {};
        }

        recordType = recordType.toUpperCase();
        if(recordType === 'MX') {
            if(!options.mx) {
                return callback(new Error('options.mx must be get on MX record'));
            }
        }

        const json = {
            sub_domain: subDomain,
            record_id: recordId,
            record_type: recordType,
            value: value,
            mx: options.mx,
            record_line: options.recordLine || '默认',
            record_line_id: options.recordLineId,
            ttl: options.ttl,
            status: options.status,
            weight: options.weight
        };
        const self = this;
        self._request(path, json, function(err, body) {
            if(err) {
                return callback(err);
            }
            const subD = new SubDomain(body.record, self);

            subD.initByAPI(function(err) {
                if(err) {
                    return callback(err);
                }
                callback(undefined, subD);
            });
        });

    }

    updateRecordByName(subDomainName, recordType, value, options, callback) {
        const path = '/Record.Modify';

        if(typeof options === 'function') {
            callback = options;
            options = {};
        }

        recordType = recordType.toUpperCase();
        if(recordType === 'MX') {
            if(!options.mx) {
                return callback(new Error('options.mx must be get on MX record'));
            }
        }

        const self = this;

        self.recordByName(subDomainName, function(err, record) {
            if(err) {
                return callback(err);
            }
            const recordId = record.id;
            self.updateRecord(recordId, subDomainName, recordType, value, options, callback);
        });
    }

    removeRecord(recordId, callback) {
        const path = '/Record.Remove';
        const params = {
            record_id: recordId
        };
        this._request(path, params, function(err) {
            if(err) {
                return callback(err);
            }
            callback();
        });
    }

    ddns(recordId, subDomainName, value, options, callback) {
        if(typeof options === 'function') {
            callback = options;
            options = {};
        }
        const route = '/Record.Ddns';

        const self = this;
        self._request(route, {
            record_id: recordId,
            sub_domain: subDomainName,
            record_line: options.recordLine || '默认',
            record_line_id: options.recordLineId,
            value: value
        }, function(err, subDomain) {
            if(err) {
                return callback(err);
            }
            const subD = new SubDomain({ id: recordId }, self);
            subD.initByAPI(function(err) {
                if(err) {
                    return callback(err);
                }
                callback(undefined, subD);
            });
        });
    }

    remark(recordId, remark, callback) {
        const path = '/Record.Remark';

        const self = this;
        self._request(path, {
            record_id: recordId,
            remark: remark
        }, function(err) {
            if(err) {
                return callback(err);
            }
            const subD = new SubDomain({ id: recordId }, self);
            subD.initByAPI(function(err) {
                if(err) {
                    return callback(err);
                }
                callback(undefined, subD);
            });
        });
    }

    setStatus(recordId, status, callback) {
        const path = '/Record.Status';

        const self = this;
        self._request(path, {
            record_id: recordId,
            status: status
        }, function(err) {
            if(err) {
                return callback(err);
            }
            const subD = new SubDomain({ id: recordId }, self);
            subD.initByAPI(function(err) {
                if(err) {
                    return callback(err);
                }
                callback(undefined, subD);
            });
        });
    }
}

module.exports = Domain;
