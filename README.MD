DDNS
======

 DDNS for [DNSPOD.com](http://www.dnspod.com) write by Node.js.

Install
-------

```shell
$ cd module
$ git github.com/mapleincode/ddns.git
$ cd ddns & npm install
```

Usage
-----
You need to  configure your  account information in 
```shell
/ddns/lib/Setting.js
```
firstly. 

Then, you just need to get the handler:

```javascript
var ddns = require("ddns");
ddns();
```

