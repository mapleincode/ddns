/**
 * Created by maple on 2018/1/12.
 */
'use strict';

const should = require('should');
const account = require('./account.json');

const DDns = require('../lib/async/Domain');
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

let recordId;



describe('Domain Async', function() {
    describe('create new record', function() {
        it('create record async', async function() {
            const record = await ddns.createRecordAsync(subDomainName, recordType, value);
            recordId = record.id;
            record.should.have.property('name').equal(subDomainName);
            record.should.have.value('value', value);
        });
    });

    describe('get record list async', function() {
        it('get record list async', async function() {
            const list = await ddns.recordListAsync(0, 200);
            list.should.be.Array();


            if (!recordId) {
                for (const record of list) {
                    if (record.name === subDomainName) {
                        recordId = record.id;
                        break;
                    }
                }
            }
        });
    });


    // describe.skip('get record by keyword', function() {
    //     let _list;

    //     it('should get record by keyword without error', async function() {
    //         this.timeout('100000');
    //         setTimeout(function() {
    //             ddns.recordByKeyword('test', function(err, list) {
    //                 should.ifError(err);
    //                 _list = list;
    //             });
    //         }, 10000);
    //     });
    //     it('list should be Array', function() {
    //         _list.should.be.Array();
    //     });

    //     it('list should has an object named ' + subDomainName, function() {
    //         let record;
    //         for(const r of _list) {
    //             if(r.name === subDomainName) {
    //                 record = r;
    //             }
    //         }
    //         record.should.be.exist();
    //         record.should.have.value('name', subDomainName);
    //     });
    // });

    describe('get record by id', function() {
        it('get record by id async', async function() {
            const record = await ddns.recordByIdAsync(recordId);
            record.should.have.property('name').equal(subDomainName);
        });
    });

    describe('modify record value', function() {
        it('modify record value async', async function() {
            const record = await ddns.updateRecordAsync(recordId, subDomainName, recordType, value2);
            record.should.have.property('value').equal(value2);
            record.should.have.property('name').equal(subDomainName);
        });
    });

    describe('set ddns', function() {
        it('set ddns async', async function() {
            const record = await ddns.ddnsAsync(recordId, subDomainName, value3);
            record.should.have.properties({ value: value3 });
        });
    });

    describe('set remark', function() {
        it('set remark async', async function() {
            await ddns.remarkAsync(recordId, remark);
            const record = await ddns.recordByIdAsync(recordId);
            record.should.have.property('remark').equal(remark);
        });
    });

    describe('set status', function() {
        it('record set status async', async function() {
            await ddns.setStatusAsync(recordId, 'disable');
            const record = await ddns.recordByIdAsync(recordId);
            record.should.have.property('status').equal('disable');
        });
    });

    describe('remove record', function() {
        it('record remove async', async function() {
            await ddns.removeRecordAsync(recordId);
        });
    });
});