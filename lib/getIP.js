/**
 * Created by maple on 2018/1/10.
 */
'use strict';

const request = require('request');

function ipme (callback) {
  request.get('http://icanhazip.com/', {
    timeout: 5000
  }, function (err, resp, body = '') {
    if (err) {
      return callback(err);
    }
    body = body.replace('\n', '');
    callback(undefined, body);
  });
}

module.exports = ipme;
