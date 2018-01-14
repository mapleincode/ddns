/**
 * Created by maple on 2018/1/12.
 */
'use strict';

const should = require('should');
const account = require('./account.json');

const DDns = require('../');
const ddns = new DDns(account.email, account.password, account.domain);

const subDomainName = 'test35';
const recordType = 'A';
const value = '127.0.0.1';
const value2 = '192.168.1.1';
const value3 = '192.168.1.2';
const remark = 'thisisremark';

let recordId;



describe('Domain', function() {
    describe('create new record', function() {
        let _record;
        it('should create without error', function(done) {
            ddns.createRecord(subDomainName, recordType, value, function(err, record) {
                should.ifError(err);
                _record = record;
                recordId = _record.id;
                done();
            });
        });

        it('record.name should equal ' + subDomainName, function(done) {
            _record.should.have.property('name').equal(subDomainName);
            done();
        });
        it('record value should equal ' + value, function(done) {
            _record.should.have.value('value', value);
            done();
        });
    });

    describe('get record list', function() {
        let _list;
        it('should get list without error', function(done) {
            ddns.recordList(0, 1, function(err, list) {
                should.ifError(err);
                _list = list;
                done();
            });
        });
        it('list should be Array', function(done) {
            _list.should.be.Array();
            done();
        });
        it('list.length should equal 1', function(done) {
            _list.should.have.length(1);
            done();
        });
    });


    describe.skip('get record by keyword', function() {
        let _list;

        it('should get record by keyword without error', function(done) {
            this.timeout('100000');
            setTimeout(function() {
                ddns.recordByKeyword('test', function(err, list) {
                    should.ifError(err);
                    _list = list;
                    done();
                });
            }, 10000);
        });
        it('list should be Array', function(done) {
            _list.should.be.Array();
            done();
        });

        it('list should has an object named ' + subDomainName, function(done) {
            let record;
            for(const r of _list) {
                if(r.name === subDomainName) {
                    record = r;
                }
            }
            record.should.be.exist();
            record.should.have.value('name', subDomainName);
            done();
        });
    });

    describe('get record by id', function() {
        let record;
        it('should get record by id without error', function(done) {
            ddns.recordById(recordId, function(err, _record) {
                should.ifError(err);
                record = _record;
                done();
            });
        });

        it('record should have property name equal ' + subDomainName, function(done) {
            record.should.have.property('name').equal(subDomainName);
            done();
        });
    });

    describe('modify record value', function() {
        let record;
        it('modify record value should without error', function(done) {
            ddns.updateRecord(recordId, subDomainName, recordType, value2, function(err, _record) {
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
            ddns.ddns(recordId, subDomainName, value3, function(err, _record) {
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
            ddns.remark(recordId, remark, function(err) {
                should.ifError(err);
                done();
            });
        });

        it('record remark should equal ' + remark, function(done) {
            ddns.recordById(recordId, function(err, record) {
                should.ifError(err);
                record.should.have.property('remark').equal(remark);
                done();
            });
        });
    });

    describe('set status', function() {
        it('record set status should without error', function(done) {
            ddns.setStatus(recordId, 'disable', function(err) {
                should.ifError(err);
                done();
            });
        });

        it('record should have property status equal disable', function(done) {
            ddns.recordById(recordId, function(err, record) {
                should.ifError(err);
                record.should.have.property('status').equal('disable');
                done();
            });
        });
    });

    describe('remove record', function() {
        it('record remove should without error', function(done) {
            ddns.removeRecord(recordId, function(err) {
                should.ifError(err);
                done();
            });
        });
    });
});