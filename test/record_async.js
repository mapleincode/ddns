/**
 * Created by maple on 2018/1/12.
 */
'use strict';

const should = require('should');
const account = require('./account.json');

const DDns = require('../lib/async/Domain');
const ddns = new DDns(account.domain, {
    loginToken: account.loginToken,
    loginId: account.loginId
});

const subDomainName = 'test35';
const recordType = 'A';
const value = '127.0.0.1';
const value2 = '192.168.1.1';
const value3 = '192.168.1.2';
const remark = 'thisisremark';

let recordObject;

describe('Record Async', function () {

    before(async function () {
        recordObject = await ddns.createRecordAsync(subDomainName, recordType, value);
        recordObject.should.be.an.Object();
    });

    after(async function () {
        try {   
            const record = await ddns.recordByNameAsync(subDomainName);
            if (record && record.id) {
                await ddns.removeRecordAsync(record.id);
            }
        } catch (err) { }
    });

    describe('modify record value', function () {
        it('modify record value should without error', async function () {
            const record = await recordObject.updateAsync(subDomainName, recordType, value2);
            record.should.have.property('value').equal(value2);
            record.should.have.property('name').equal(subDomainName);
        });
    });

    describe('set ddns', function () {
        it('set ddns should without error', async function () {
            const record = await recordObject.setDnsAsync(value3);
            record.should.have.properties({ value: value3 });
        });
    });

    describe('set remark', function () {
        it('set remark should without error', async function () {
            const record = await recordObject.setRemarkAsync(remark);
            const _record = await ddns.recordByIdAsync(record.id);
            _record.should.have.property('remark').equal(remark);
        });
    });

    describe('set status', function () {
        it('record set status should without error', async function () {
            const record = await recordObject.setStatusAsync('disable');
            const _record = await ddns.recordByIdAsync(record.id);
            _record.should.have.property('status').equal('disable');
        });
    });

    describe('remove record', function () {
        it('record remove should without error', async function () {
            await recordObject.removeAsync();
            try {
                await ddns.recordByIdAsync(recordObject.id);
            } catch (err) {
                should(err).be.an.Object();
                err.message.should.be.startWith('记录ID');
            }
        });
    });
});