var http = require('http');
var url = require('url');
var spidex =require('spidex');
var setting = require('./lib/Setting.js')


function changeIpInServer(localhostIp, domainId, recordId, recordType){
	var changeIpJson = {
		login_email		: setting.email,
		login_password	: setting.password,
		format			: 'json',
		domain_id		: domainId,
		sub_domain 		: setting.subdomain,
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
			return callback(new Error('Error while parse result:'+ e.message));
		}
		if(json.status.code !== '1'){
			return callback (new Error('Error res with code : ' + json.status.code));
		}
		else{
			console.log('STATE: IP UPDATE SUCCESS!');
		}
	}, changeIpJson, "utf8").on('error', callback);

};


function getDataFromServer(localhostIp) {
	if(localhostIp == '')
		return;

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
			return callback(new Error('Error status while fetching DNS record.'));
		}
		var json;
		try {
			json = JSON.parse(html);
		}
		catch(e)
		{
			return callback (new Error ('Error while parsing DNS records' + e.message));
		}
		if(json.status.code !== '1'){
			return callback(new Error('Error res with code: '+json.status.code));
		}
		else{
			domainId = json.domain.id;
			for(var a in json.records) {
				if(json.records[a].sub_domain == setting.subdomain) {
					valueIp 	= json.records[a].value;
					recordId 	= json.records[a].id;
					recordType 	= json.records[a].record_type;
				}
			}
			console.log('STATE: VALUE_IP: ' + valueIp + '.');
			if(localhostIp !== valueIp){
				return changeIpInServer(localhostIp, domainId, recordId, recordType);
			}else{
				console.log('STATE: IP NO CHANGE\n');
			}
		}
	}, getValuesJson, 'utf8').on('error', callback);

}


function getIp() {
	var options = {
		hostname	: url.parse('http://www.telize.com').hostname,
		path		: '/ip',
		method		: 'GET',
		port		: 80
	};
	var localhostIp = '';
	var req = http.request(options,function(res){
		res.setEncoding('utf8');
		res.on('data', function(chunk){
			var num = chunk.length-1;
			localhostIp = chunk.slice(0,num);
    		console.log('STATE: LOCALHOST_IP: '+localhostIp+'.');
    		return getDataFromServer(localhostIp);
		})
	});

	req.on('error',function (e){
		console.log('request error:'+e);
	});
	req.write('data\n');
	req.end();
};


function callback(err) {
	console.error(err);
};


getIp();
