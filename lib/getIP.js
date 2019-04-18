/**
 * Created by maple on 2018/1/10.
 */
'use strict';

const request = require('request');

// function taobao(callback) {
//     const url = 'http://ip.taobao.com/service/getIpInfo2.php?ip=myip';

//     request.get(url, {
//         timeout: 5000,
//         json: true
//     }, function(err, resp, body) {
//         if(err) {
//             return callback(err);
//         }
//         if(!body || body.code !== 0) {
//             return callback(new Error('request IP API fail!'));
//         }
//         return callback(undefined, body.data.ip);
//     });
// }

function ipme(callback) {
    request.get('http://icanhazip.com/', {
        timeout: 5000
    }, function(err, resp, body = '') {
        if(err) {
            return callback(err);
        }
        body = body.replace('\n', '');
        callback(body);
    });
}

module.exports = ipme;
