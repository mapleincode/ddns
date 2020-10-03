/**
 * Created by maple on 2018/1/10.
 */
'use strict';
class SubDomain {
  constructor (subDomainJson, domain) {
    this._data = {};
    if (subDomainJson) {
      this.init(subDomainJson);
    } else {
      this.deleteStatus = true;
    }
    if (domain) {
      this.setDomain(domain);
    }
  }

  toJSON (options = {}) {
    const domain = this._data.toJSON(options);
    return {
      domainData: {
        ...domain
      },
      ...this._data,
      name: this.name,
      id: this.id,
      value: this.value,
      remark: this.remark,
      recordType: this.recordType,
      type: this.recordType,
      status: this.status,
      deleteStatus: this.deleteStatus,
      domain: domain.name
    };
  }

  init (subDomainJson) {
    if (typeof subDomainJson !== 'object') {
      throw new Error('init sub-domain error!');
    }
    this._data = subDomainJson;

    this.name = subDomainJson.name || subDomainJson.sub_domain;
    this.id = subDomainJson.id;
    this.value = subDomainJson.value;
    this.remark = subDomainJson.remark;
    this.recordType = subDomainJson.recordType || subDomainJson.type;
    this.type = this.recordType;
    this.status = this._convertStatus(subDomainJson);

    // ------

    this.deleteStatus = false;
  }

  _convertStatus (data = {}) {
    if (data.enabled === '1') {
      return 'enable';
    }
    if (data.enabled && data.enabled !== '1') {
      return 'disable';
    }
    if (data.status === 'enabled') {
      return 'enable';
    }
    if (data.status === 'disabled') {
      return 'disable';
    }
    return 'enable';
  }

  setDomain (domain) {
    this._domain = domain;
  }

  initByAPI (callback) {
    const recordId = this.id;
    const self = this;
    self._domain.recordById(recordId, function (err, json) {
      if (err) {
        callback(err);
      }
      self.init(json);
      callback(undefined, self);
    }, true);
  }

  clone (newRecord) {
    if (newRecord === null) {
      // removed
      this.deleteStatus = true;
      return;
    }

    this.init(newRecord._data);
    this._domain = newRecord._domain;
  }

  // update(options, callback);
  // update(subDomain, recordType, value, callback);
  update (subDomain, recordType, value, options, callback) {
    // object 更新
    if (typeof subDomain === 'object' && typeof recordType === 'function') {
      const {
        name: _subDomain,
        recordType: _recordType,
        value: _value
      } = subDomain;
      options = subDomain;
      callback = recordType;
      subDomain = _subDomain || this.name;
      recordType = _recordType || this.recordType;
      value = _value || this.value;
    }

    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    if (this.deleteStatus) {
      return callback(new Error('record has already removed'));
    }

    const domain = this._domain;
    const recordId = this.id;

    const self = this;
    domain.updateRecord(recordId, subDomain, recordType, value, options, function (err, record) {
      if (err) {
        return callback(err);
      }
      self.clone(record);
      callback(undefined, self);
    });
  }

  setDns (value, options = {}, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    if (this.deleteStatus) {
      return callback(new Error('record has already removed'));
    }
    const domain = this._domain;
    const recordId = this.id;
    const subDomainName = this.name;

    const self = this;

    if (!options.forceUpdate && value === this.value) {
      return callback(new Error('same value'));
    }

    domain.ddns(recordId, subDomainName, value, {}, function (err, record) {
      if (err) {
        return callback(err);
      }
      self.clone(record);
      callback(undefined, self);
    });
  }

  ddns (callback) {
    const self = this;

    if (this.deleteStatus) {
      return callback(new Error('record has already removed'));
    }
    const domain = this._domain;
    const recordId = this.id;
    const subDomainName = this.name;

    const value = this.value;

    domain.getIP(function (err, ip) {
      if (err) {
        return callback(err);
      }

      if (ip === value) {
        return callback(undefined, self);
      }

      domain.ddns(recordId, subDomainName, ip, {}, function (err, record) {
        if (err) {
          return callback(err);
        }
        self.clone(record);
        callback(undefined, self);
      });
    });
  }

  setRemark (remark, callback) {
    if (this.deleteStatus) {
      return callback(new Error('record has already removed'));
    }
    const domain = this._domain;
    const recordId = this.id;

    const self = this;
    domain.remark(recordId, remark, function (err, record) {
      if (err) {
        return callback(err);
      }
      self.clone(record);
      callback(undefined, self);
    });
  }

  setStatus (status, callback) {
    if (this.deleteStatus) {
      return callback(new Error('record has already removed'));
    }
    const domain = this._domain;
    const recordId = this.id;

    const self = this;
    domain.setStatus(recordId, status, function (err, record) {
      if (err) {
        return callback(err);
      }
      self.clone(record);
      callback(undefined, self);
    });
  }

  remove (callback) {
    if (this.deleteStatus) {
      return callback(new Error('record has already removed'));
    }

    const domain = this._domain;
    const recordId = this.id;

    const self = this;
    domain.removeRecord(recordId, function (err) {
      if (err) {
        return callback(err);
      }
      self.deleteStatus = true;
      callback();
    });
  }
}

module.exports = SubDomain;
