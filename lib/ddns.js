var http = require('http');
var url = require('url');
var spidex =require('spidex');
var setting = require('./Setting.js');
var moment = require('moment');


function changeIpInServer(localhostIp, domainId, subdomain, recordId, recordType, callback){
	var changeIpJson = {
		login_email		: setting.email,
		login_password		: setting.password,
		format			: 'json',
		domain_id		: domainId,
		sub_domain 		: subdomain,
		record_id		: recordId,
		record_type		: recordType,
		value 			: localhostIp,
		record_line		: '默认'
	};

	var url = 'https://dnsapi.cn/Record.Modify';

	spidex.post(url, function(html){
		var json;
		try {
			json = JSON.parse(html);

		}
		catch(e){
			return callback(new Error('[DDNS] 修改网站配置 while parse result:'+ e.message + ' sub-domain: ' + subdomain));
		}
		if(json.status.code !== '1'){
			return callback (new Error('[DDNS] 修改网站配置 res with code : ' + json.status.code + ' sub-domain: ' + subdomain));
		}
		else{
			console.log('[DDNS] 修改网站配置 成功' + ' sub-domain: ' + subdomain);
			return callback(undefined);
		}
	}, changeIpJson, "utf8").on('error', callback);

}


function getDataFromServer(localhostIp, callback) {
	if(localhostIp === '')
		return callback(new Error('[DDNS] 获取网站配置 localhost Ip in miss!'));
	console.log('[DDNS] 获得网站配置');

	var url = "https://dnsapi.cn/Monitor.Listsubvalue";
	var getValuesJson = {
		login_email		: setting.email,
		login_password	: setting.password,
		format			: 'json',
		domain			: setting.domain,
		record_line		: '默认',
		submain 		: setting.subdomain
	};

	var domainId;
	var recordId;
	var recordType;
	var valueIp;

	spidex.post(url, function(html, status){
		if(status !== 200){
			return callback(new Error('[DDNS] 获取网站配置 status while fetching DNS record.'));
		}
		var json;
		try {
			json = JSON.parse(html);
			// console.log(json);
		}
		catch(e)
		{
			return callback (new Error ('[DDNS] 获取网站配置 while parsing DNS records' + e.message));
		}
		if(json.status.code !== '1'){
			return callback(new Error('[DDNS] 获取网站配置 res with code: '+json.status.code));
		}
		else{
			domainId = json.domain.id;
			var needChange = [];
			json.records = [].concat(json.records);
			for(var i = 0; i < json.records.length; i ++) {
				if (setting.subdomain.indexOf(json.records[i].sub_domain) !== -1) {
					console.log('[DDNS] 获得网站配置 sub-domain: ' + json.records[i].sub_domain + ' 记录IP: ' + json.records[i].value);
					if (json.records[i].value !== localhostIp) {
						console.log('[DDNS] 获得网站配置 sub-domain: ' + json.records[i].sub_domain + ' 记录IP与本地IP不符');
						needChange.push({
							subDomain: json.records[i].sub_domain,
							valueIp: json.records[i].value,
							recordId: json.records[i].id,
							recordType: json.records[i].record_type
						});
					}
					else {
						console.log('[DDNS] 获得网站配置 sub-domain: ' + json.records[i].sub_domain + ' 记录IP与本地IP相同');
					}
				}
			}

			if (needChange.length === 0) {
				console.log('[DDNS] 更新IP数据 无不相同的IP配置');
				return callback(undefined);
			}
			else {
				console.log('[DDNS] 更新IP数据 开始更新IP sub-domain 数量为' + needChange.length);
				async.eachLimit(needChange, 1, function(sub, microCb) {
					changeIpInServer(localhostIp, domainId, sub.subDomain, sub.recordId, sub.recordType, microCb);
				}, callback);
			}
			// for(var a in json.records) {
				// if(json.records[i].sub_domain == setting.subdomain) {
				// 	valueIp 	= json.records[i].value;
				// 	recordId 	= json.records[i].id;
				// 	recordType 	= json.records[i].record_type;
				// }
			// }
			// console.log('[DDNS] 获取网站配置 配置IP: ' + valueIp + '.');
			// if (localhostIp !== valueIp){
			// 	// return callback(undefined, localhostIp, domainId, recordId, recordType);
			// 	// return changeIpInServer(localhostIp, domainId, recordId, recordType);
			// }
			// else{
			// 	// console.log('STATE: IP NO CHANGE\n');
			// 	return callback('[DDNS] 获取网站配置 配置IP 与 本地IP 相同');
			// }
		}
	}, getValuesJson, 'utf8').on('error', callback);

}


function getIp(callback) {
	console.log('[DDNS] 开始获得本地IP');
	var options = {
		hostname	: 'ip.taobao.com',
		path		: '/service/getIpInfo2.php?ip=myip',
		method		: 'GET',
		port		: 80,
		dataType: 'json'
	};
	// console.log(options)
	var localhostIp = '';
	var req = http.request(options,function(res){
		res.setEncoding('utf-8');
		res.on('data', function(chunk){
			// console.log(chunk);
			try {
				// chunk = unescape(chunk.replace(/\\u/gi, '%u'));
				chunk = JSON.parse(chunk);
			}
			catch(e) {
				if (e) {
					return callback(new Error('[DDNS] 获得本地IP 格式化JSON错误 >> ' + e));	
				}
			}
			// console.log(chunk);
			if (!chunk && !chunk.data) {
				return callback(new Error('[DDNS] 获得本地IP 返回错误json'));
			}
			else {
				console.log('[DDNS] 获得本地IP 本地IP为: ' + chunk.data.ip);
				return callback(undefined, chunk.data.ip);
			}
		});
	});
	req .end();
	req.on('error',function (err){ 
		return callback(new Error('[DDNS] [DDNS] 获得本地IP 发送请求失败' + err.message));
	});

}
var async = require('async');
var ddns = function(callback) {
	var date = new Date();
	console.log(moment(date).format('YYYY年MM月DD日 hh:mm:ss'));
	async.waterfall([getIp, getDataFromServer], function(err) {
		if (err) {
			console.log(err.message || err);
		}
		if (callback) {
			return callback(err);
		}
	});
};

exports.ddns = ddns;
exports.ddnsAuto = function() {
	setInterval(function() {
		ddns();
	}, 20000);
};
// exports.ddnsAuto();
// exports.ddns();
// getIp(console.log);


// function callback(err) {
// 	console.error(err);
// };

