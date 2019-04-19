简单的 DNS 修改 Record 的包。 [https://DNSpod.cn](https://DNSpod.cn)。支持 callback & Promise & async/await。

## 用法

```
const DDNS = require('wm-ddns');
const domain = new DDNS('email', 'passwd', 'domain.com'); // 旧版本鉴权
const newDomain = new DDNS('domain.com', { loginToken: '', loginId: '' });
```
> 目前 DNSpod 已经不推荐用账户密码进行鉴权，而是申请一套鉴权。
>
> 鉴权包含 token 和 id 两部分。 token 只有在申请成功显示一次。

### Domain 对象

domai 对象

Examples:
```javascript
const DDns = require('wm-ddns');
const domain = new DDns('email', 'passwd', 'domain.com');

domain.create("@", "A", '127.0.0.1', function(err, record) {
	// ..
});

```


#### domain.createRecord(subDomain, recordType, value, [options], callback)

create record

* `subDomain` sub-domain, default `@`
* `recordType` record type.like `A`, `CANME`
* `value` record value.
* `options` optional params
	* `MX`
	* `recordLine` default `默认`
	* `recordLineId`
	* `ttl`
	* `status`
	* `weight`
* `callback`
	* `err`
	* `record` record object

#### domain.recordList([offset, length], callback)

get records by page

* `offset` default 0
* `length` defualt 300
* `callback`
	* `err` err
	* `record-list` records list

#### domain.recordByName(subDomain, callback, json)

get record by name

* `subDomain` sub-domain
* `callback`
	* `err`
	* `record` record object
* `json` default false.if true, callback json.

#### domain.recordById(recordId, callback, json)

get record by record id

* `recordId` record id
* `callback`
	* `err`
	* `record` record object
* `json` default false.if value is true, it will callback a json.

#### domain.recordByKeyword(keyword, [offset, length], callback)

get record by keyword.

* `keyword` keyword
* `callback`
	* `err`
	* `record` record object
* `json` default false.if true, callback json.
* `callback`
	* `err`
	* `record` record object
#### domain.updateRecord(recordId, subDomain, value, [options, ]callback)
update record by recordId

* `recordId` recordId
* `subDomain` subDomain
* `value` value
* `options`
	* `mx`
	* `recordLine` default `默认`
	* `recordLineId`
	* `ttl`
	* `status`
	* `weight`
* `callback`
	* `err`
	* `record` record object

#### domain.updateRecordByName(subDomain, recordType, value, [options, ]callback)
update record by subDomain

* `subDomain` subDomain
* `value` value
* `options`
	* `mx`
	* `recordLine` default `默认`
	* `recordLineId`
	* `ttl`
	* `status`
	* `weight`
* `callback`
	* `err`
	* `record` record object

#### domain.removeRecord(recordId, callback)
remove record

* `recordId` recordId

#### domain.ddns(value, callback)

* `value` value
* `callback`
	* `err`
	* `record` record object

#### domain.remark(remark, callback)

* `remark` remark value
* `callback`
	* `err`
	* `record` record object

#### domain.setStatus(status, callback)

* `status` status value
* `callback`
	* `err`
	* `record` record object

### Record

> DNS record
>
> DNS 记录

#### record.toJSON()

convert record object to json object;

#### record.clone(record)

clone record from another record

#### record.update(subDomain, recordType, value, options, callback)

update record info

* `subDomain` subDomain
* `recordType` `A`, `CNAME`, etc.
* `value` value
* `options`
	* `mx`
	* `recordLine` default `默认`
	* `recordLineId`
	* `ttl`
	* `status`
	* `weight`
* `callback`
	* `err`
	* `record` record object

#### record.setDns(value, callback)

update record dns

* `value` value
* `callback`
	* `err`
	* `record` record object

#### record.ddns(callback)

set value by local public ip.
get ip by `domain.getIP()`.

* `callback`
	* `err`
	* `record` record object

#### record.setRemark(remark, callback)

set remark.

* `remark` remark
* `callback`
	* `err`
	* `record` record object

#### record.setStatus(status, callback)

set status.

* `status` status
* `callback`
	* `err`
	* `record` record object



## Promise & async/await

> 支持 promise
>
> 通过 `util.promiseify()` 转换

```javascript
const DDNS = require('wm-ddns').Domain;
const domain = new DDNS('email', 'passwd', 'domain.com'); // 旧版本鉴权
const newDomain = new DDNS('domain.com', { loginToken: '', loginId: '' }); //新版本鉴权

async done() {
    const record = await domain.createRecord('name', 'type', 'value');
    await domain.removeRecord(record.id);
}

done();
```

