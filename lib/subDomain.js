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
        this.init(newRecord._data);
        this._domain = newRecord._domain;
    }
}

module.exports = SubDomain;
