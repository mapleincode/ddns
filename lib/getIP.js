/**
 * Created by maple on 2018/1/10.
 */
'use strict';

const request = require('request');

module.exports = function(callback) {
    const url = 'http://ip.taobao.com/service/getIpInfo2.php?ip=myip';

    request.get(url, {
        timeout: 5000,
        json: true
    }, function(err, resp, body) {
        if(err) {
            return callback(err);
        }
        if(!body || body.code !== 0) {
            return callback(new Error('request IP API fail!'));
        }
        return callback(undefined, body.data.ip);
    });
};
