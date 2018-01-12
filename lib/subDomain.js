/**
 * Created by maple on 2018/1/10.
 */
"use strict";

class SubDomain {
    constructor(subDomainJson, domain) {
        this.initState = false;
        this._data = {};
        if(subDomainJson) {
            this.init(subDomainJson);
        } else {
            this.deleteStatus = true;
        }
        if(domain) {
            this.setDomain(domain);
        }
    }
    init(subDomainJson) {
        if(typeof subDomainJson !== 'object') {
            throw new Error('init sub-domain error!');
        }
        this._data = subDomainJson;
        this.initState = true;

        this.name = subDomainJson.name || subDomainJson['sub_domain'];
        this.id = subDomainJson.id;
        this.value = subDomainJson.value;
        this.remark = subDomainJson.remark;
        this.status = subDomainJson.status;
        this.recordType = subDomainJson['recordType'];

        if(subDomainJson.enabled) {
            if(subDomainJson.enabled === '1') {
                this.status = 'enable';
            } else {
                this.status = 'disable';
            }
        }

        if(this.status === 'enabled') {
            this.status = 'enable';
        } else if(this.status === 'disabled') {
            this.status = 'disable';
        }

        this.deleteStatus = false;
    }
    setDomain(domain) {
        this._domain = domain;
    }

    toJSON() {
        return this._data;
    }
    initByAPI(callback) {
        const recordId = this.id;
        const self = this;
        self._domain.recordById(recordId, function(err, json) {
            if(err) {
                callback(err);
            }
            self.init(json);
            callback(undefined, self);
        }, true)
    }
    clone(newRecord) {
        if(newRecord === null) {
            // removed
            this.deleteStatus = true;
            return;
        }

        this.init(newRecord._data);
        this._domain = newRecord._domain;
    }

    update(subDomain, recordType, value, options, callback) {
        if(typeof options === 'function') {
            callback = options;
            options = {};
        }

        if(this.deleteStatus) {
            return callback(new Error('record has already removed'));
        }

        const domain = this._domain;
        const recordId = this.id;

        const self = this;
        domain.updateRecord(recordId, subDomain, recordType, value, options, function(err, record) {
            if(err) {
                return callback(err);
            }
            self.clone(record);
            callback(undefined, self);
        });
    }

    setDns(value, callback) {
        if(this.deleteStatus) {
            return callback(new Error('record has already removed'));
        }
        const domain = this._domain;
        const recordId = this.id;
        const subDomainName = this.name;

        domain.ddns(recordId, subDomainName, value, {}, function(err, record) {
            if(err) {
                return callback(err);
            }
            self.clone(record);
            callback(undefined, self);
        });
    }

    ddns(callback) {
        if(this.deleteStatus) {
            return callback(new Error('record has already removed'));
        }
        const domain = this._domain;
        const recordId = this.id;
        const subDomainName = this.name;

        domain.getIP(function(err, ip) {
            if(err) {
                return callback(err);
            }

            domain.ddns(recordId, subDomainName, ip, {}, function(err, record) {
                if(err) {
                    return callback(err);
                }
                self.clone(record);
                callback(undefined, self);
            });
        });
    }

    setRemark(remark, callback) {
        if(this.deleteStatus) {
            return callback(new Error('record has already removed'));
        }
        const domain = this._domain;
        const recordId = this.id;

        domain.remark(recordId, remark, function(err, record) {
            if(err) {
                return callback(err);
            }
            self.clone(record);
            callback(undefined, self);
        });
    }

    remove(callback) {
        if(this.deleteStatus) {
            return callback(new Error('record has already removed'));
        }

        const domain = this._domain;
        const recordId = this.id;

        const self = this;
        domain.removeRecord(recordId, function(err) {
            if(err) {
                return callback(err);
            }
            self.deleteStatus = true;
            callback();
        });
    }
}

module.exports = SubDomain;
