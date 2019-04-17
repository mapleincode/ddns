/**
 * Created by maple on 2018/1/12.
 */
'use strict';

const should = require('should');
const account = require('./account.json');

const DDns = require('../');
const ddns = new DDns(account.email, account.password, account.domain, {
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

describe('Record', function() {

    before(function(done) {
        ddns.createRecord(subDomainName, recordType, value, function(err, _record) {
            should.ifError(err);
            recordObject = _record;
            done();
        });
    });

    after(function() {
        ddns.recordByName(subDomainName, function(err, record) {
            if(err) {
                console.error(err);
            }
            if(record && record.id) {
                ddns.removeRecord(record.id, function(err) {
                    if(err) {
                        console.error(err);
                    } else {
                        console.log('remove success!');
                    }
                });
            }
        });
    });

    describe('modify record value', function() {
        let record;

        it('modify record value should without error', function(done) {
            recordObject.update(subDomainName, recordType, value2, function(err, _record) {
                should.ifError(err);
                record = _record;
                done();
            });
        });

        it('new record should have value ' + value2, function(done) {
            record.should.have.property('value').equal(value2);
            done();
        });

        it('new record should have name ' + subDomainName, function(done) {
            record.should.have.property('name').equal(subDomainName);
            done();
        });
    });

    describe('set ddns', function() {
        let record;
        it('set ddns should without error', function(done) {
            recordObject.setDns(value3, function(err, _record) {
                should.ifError(err);
                record = _record;
                done();
            });
        });

        it('record\'s value should be equal ' + value3, function (done) {
            record.should.have.properties({ value: value3 });
            done();
        });
    });

    describe('set remark', function() {
        let record;
        it('set remark should without error', function(done) {
            recordObject.setRemark(remark, function(err, _record) {
                should.ifError(err);
                record = _record;
                done();
            });
        });

        it('record remark should equal ' + remark, function(done) {
            ddns.recordById(record.id, function(err, record) {
                should.ifError(err);
                record.should.have.property('remark').equal(remark);
                done();
            });
        });
    });

    describe('set status', function() {
        it('record set status should without error', function(done) {
            recordObject.setStatus('disable', function(err) {
                should.ifError(err);
                done();
            });
        });

        it('record should have property status equal disable', function(done) {
            ddns.recordById(recordObject.id, function(err, record) {
                should.ifError(err);
                record.should.have.property('status').equal('disable');
                done();
            });
        });
    });

    describe('remove record', function() {
        it('record remove should without error', function(done) {
            recordObject.remove(function (err, record) {
                should.ifError(err);
                done();
            });
        });

        it('record should not be not query', function() {
            ddns.recordById(recordObject.id, function(err) {
                err.should.be.exist();
                err.message.should.be.startWith('没有记录');
                done();
            });
        });
    });
});