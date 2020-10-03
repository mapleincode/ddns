/**
 * Created by maple on 2018/1/10.
 */
'use strict';

const _ = require('lodash');
const request = require('request');

const getIP = require('./getIP');
const getError = require('./getError');

class Domain {
  constructor (email, password, domainName, options = {}) {
    if (email && typeof email === 'string' && password && typeof password === 'object') {
      domainName = email;
      options = password;
      email = null;
      password = null;
    }

    this._account = {
      options: options,
      email,
      password,
      loginToken: options.loginToken,
      loginId: options.loginId,
      token: `${options.loginId},${options.loginToken}`
    };

    this._server = {
      baseURI: 'https://dnsapi.cn'
    };

    this._domain = {
      domainName: domainName,
      domainId: options.domainId
    };

    this._domainInfo = {

    };

    this._func = {
      getIP: options.getIP || getIP,
      getError: options.getError || getError
    };

    this._recordList = [];

    this._checkParams();

    this.SubDomain = require('./SubDomain');
  }

  get domain () {
    return {
      name: this._domain.domainName,
      id: this._domain.domainId
    };
  }

  get records () {
    return this._recordList;
  }

  get recordsCount () {
    return this._recordList.length;
  }

  get getIP () {
    return this._func.getIP;
  }

  set getIP (func) {
    this._func.getIP = func;
  }

  _checkParams () {
    if (!this._account.loginId) {
      throw new Error('loginId can\'t be null');
    }
    if (!this._account.loginToken) {
      throw new Error('loginToken can\'t be null');
    }
    if (!this._domain.domainName) {
      throw new Error('domain can\'t be null');
    }
  }

  _request (path, json, callback) {
    if (typeof json !== 'object') {
      json = {};
    }

    json.login_token = this._account.token;
    json.format = 'json';
    json.domain = this._domain.domainName;

    if (this._domain.domainId) {
      json.domain_id = this._domain.domainId;
    }

    const self = this;

    request.post({
      uri: self._server.baseURI + path,
      form: json,
      json: true
    }, function (err, resp, body) {
      if (err) {
        return callback(err);
      }
      if (!body) {
        return callback(new Error('API 返回 body 不存在!'));
      }
      const status = body.status;
      if (status.code !== '1') {
        const error = self._func.getError(path, status.code, status.message);
        return callback(error);
      }
      if (body.domain) {
        self._domain = _.assign(self._domain, body.domain);
      }
      if (body.info) {
        self._domainInfo = _.assign(self._domainInfo, body.info);
      }
      try {
        delete body.status;
        delete body.domain;
        // eslint-disable-next-line no-empty
      } catch (ex) {}
      callback(undefined, body);
    });
  }

  recordList (offset, length, callback) {
    let fetchAll = false;
    // 判断 offset 是否为 callback
    if (typeof offset === 'function') {
      fetchAll = true;

      callback = offset;
      offset = 0;
      length = 3000;
    }

    const path = '/Record.List';

    const self = this;
    this._request(path, {
      offset,
      length
    }, function (err, result) {
      if (err) {
        return callback(err);
      }
      const recordList = result.records.map(record => new self.SubDomain(record, self));

      if (fetchAll) {
        self._recordList = recordList;
      }

      callback(undefined, recordList);
    });
  }

  recordByName (subDomainName, json, callback) {
    if (typeof json === 'function') {
      if (typeof callback === 'boolean') {
        const tmp = callback;
        callback = json;
        json = tmp;
      } else {
        callback = json;
        json = false;
      }
    }

    const path = '/Record.List';
    const offset = 0;
    const length = 1;
    const self = this;
    this._request(path, {
      offset,
      length,
      sub_domain: subDomainName
    }, function (err, result) {
      if (err) {
        return callback(err);
      }

      if (json) {
        callback(undefined, result.records[0]);
      } else {
        callback(undefined, result.records.map(record => new self.SubDomain(record, self))[0]);
      }
    });
  }

  recordById (recordId, callback) {
    const path = '/Record.Info';

    const self = this;

    this._request(path, {
      record_id: recordId
    }, function (err, body) {
      if (err) {
        return callback(err);
      }
      if (!body.record) {
        return callback(undefined, null);
      }
      return callback(undefined, new self.SubDomain(body.record, self));
    });
  }

  recordByKeyword (keyword, offset, length, callback) {
    if (typeof offset === 'function') {
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
    }, function (err, result) {
      if (err) {
        return callback(err);
      }
      const recordList = result.records.map(record => new self.SubDomain(record, self));
      callback(undefined, recordList);
    });
  }

  setGetIPFunction (func) {
    if (typeof func !== 'function') {
      throw new Error('error get ip function!');
    }
    this._func.getIP = func;
  }

  createRecord (subDomain, recordType, value, options, callback) {
    const path = '/Record.Create';

    subDomain = subDomain || '@';

    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    recordType = recordType.toUpperCase();
    if (recordType === 'MX') {
      if (!options.mx) {
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
    self._request(path, json, function (err, body) {
      if (err) {
        return callback(err);
      }

      const subD = new self.SubDomain(body.record, self);

      subD.initByAPI(function (err) {
        if (err) {
          return callback(err);
        }
        callback(undefined, subD);
      });
    });
  }

  updateRecord (recordId, subDomain, recordType, value, options, callback) {
    const path = '/Record.Modify';

    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    recordType = recordType.toUpperCase();
    if (recordType === 'MX') {
      if (!options.mx) {
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
    self._request(path, json, function (err, body) {
      if (err) {
        return callback(err);
      }
      const subD = new self.SubDomain(body.record, self);

      subD.initByAPI(function (err) {
        if (err) {
          return callback(err);
        }
        callback(undefined, subD);
      });
    });
  }

  updateRecordByName (subDomainName, recordType, value, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    recordType = recordType.toUpperCase();
    if (recordType === 'MX') {
      if (!options.mx) {
        return callback(new Error('options.mx must be get on MX record'));
      }
    }

    const self = this;

    self.recordByName(subDomainName, function (err, record) {
      if (err) {
        return callback(err);
      }
      const recordId = record.id;
      self.updateRecord(recordId, subDomainName, recordType, value, options, callback);
    });
  }

  removeRecord (recordId, callback) {
    const path = '/Record.Remove';
    const params = {
      record_id: recordId
    };
    this._request(path, params, function (err) {
      if (err) {
        return callback(err);
      }
      callback();
    });
  }

  ddns (recordId, subDomainName, value, options, callback) {
    if (typeof options === 'function') {
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
    }, function (err) {
      if (err) {
        return callback(err);
      }
      const subD = new self.SubDomain({ id: recordId }, self);
      subD.initByAPI(function (err) {
        if (err) {
          return callback(err);
        }
        callback(undefined, subD);
      });
    });
  }

  remark (recordId, remark, callback) {
    const path = '/Record.Remark';

    const self = this;
    self._request(path, {
      record_id: recordId,
      remark: remark
    }, function (err) {
      if (err) {
        return callback(err);
      }
      const subD = new self.SubDomain({ id: recordId }, self);
      subD.initByAPI(function (err) {
        if (err) {
          return callback(err);
        }
        callback(undefined, subD);
      });
    });
  }

  setStatus (recordId, status, callback) {
    const path = '/Record.Status';

    const self = this;
    self._request(path, {
      record_id: recordId,
      status: status
    }, function (err) {
      if (err) {
        return callback(err);
      }
      const subD = new self.SubDomain({ id: recordId }, self);
      subD.initByAPI(function (err) {
        if (err) {
          return callback(err);
        }
        callback(undefined, subD);
      });
    });
  }

  toJSON (options = {}) {
    const { showAccount = false } = options;
    const data = {
      server: this._server,
      ...this._domainInfo,
      ...this._domain,
      id: this._domain.domainId,
      domain: this._domain.domainName,
      name: this._domain.domainName
    };

    if (showAccount) {
      Object.assign(data, {
        account: {
          ...this._account
        }
      });
    }
    return data;
  }
}

module.exports = Domain;
