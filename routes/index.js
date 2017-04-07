const getToken = require('../api/getToken.js');
const getUserInfo = require('../api/getUserInfo.js');
const modal = require('../modal/index');
const sign = require('../sign.js');
const config = require('../config');
const qs = require('querystring');
const request = require('request');
global.access_token = null;
global.jsapi_ticket = null;
module.exports = function (app) {
    app.get('/sign', function (signReq, signRes) {
        let reqUrl = 'https://api.weixin.qq.com/cgi-bin/token?';
        let params = {
            appid: config.appId,
            secret: config.appSecret,
            grant_type: 'client_credential'
        };
        let options = {
            method: 'get',
            url: reqUrl + qs.stringify(params)
        };
        request(options, function (err, res, body) {
            if (res) {
                console.log(body);
                global.access_token = JSON.parse(body)
                let reqUrl1 = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?';
                let params1 = {
                    access_token: global.access_token.access_token,
                    type: 'jsapi'
                }
                let options = {
                    method: 'get',
                    url: reqUrl1 + qs.stringify(params1)
                };
                request(options, function (err, res, body1) {
                    console.log(body1);
                    if (res) {
                        global.jsapi_ticket = JSON.parse(body1);
                        var signData = sign(jsapi_ticket.ticket, decodeURIComponent(signReq.query.url));
                        var signTEST = Object.assign({}, {
                            debug: false,
                            appId: config.appId,
                            jsApiList: config.jsApiList
                        }, signData);
                        console.log(signTEST)
                        signRes.send({
                            sign: signTEST
                        })
                    }
                });
            }
        })
    });
    app.get('/user', function (req, res) {
        getToken(req.query.code)
            .then(data => JSON.parse(data))
            .then(data => getUserInfo(data['access_token'], data['openid']))
            .then(userinfo => {
                res.send({
                    userInfo: JSON.parse(userinfo)
                });
            });
    });
    app.get('/datas', function (req, res) {
        modal.queryDatas(function (err, data) {
            res.send(data);
        });
    });
    app.post('/pv', function (req, res) {
        if (req.body.openid) {
            modal.insertPv(req.body, (err, result) => {
                if (result) {
                    res.send({
                        'code': '1'
                    })
                } else {
                    res.send({
                        'code': '0',
                        'msg': '系统错误'
                    })
                }
            });
        } else {
            res.send({
                'code': '0'
            })
        }
    });
    app.post('/scroe', function (req, res) {
        if (req.body.openid) {
            modal.insertUserScore(req.body, (err, result) => {
                if (result) {
                    res.send({
                        'code': '1',
                        'users': result.users,
                        'rank': result.rank,
                        'score': result.score
                    })
                } else {
                    res.send({
                        'code': '0',
                        'msg': '系统错误'
                    })
                }
            });
        } else {
            res.send({
                'code': '0'
            })
        }
    });
    app.post('/share', function (req, res) {
        if (req.body.openid) {
            modal.insertUserShare(req.body, (err, result) => {
                if (result) {
                    res.send({
                        'code': '1'
                    })
                } else {
                    res.send({
                        'code': '0',
                        'msg': '系统错误'
                    })
                }
            });
        } else {
            res.send({
                'code': '0'
            })
        }
    });
    app.post('/userInfo', function (req, res) {
        if (req.body.openid) {
            modal.insertUserInfo(req.body, (err, result) => {
                if (result) {
                    res.send({
                        'code': '1'
                    })
                } else {
                    res.send({
                        'code': '0',
                        'msg': '系统错误'
                    })
                }
            });
        } else {
            res.send({
                'code': '0'
            })
        }
    });
};
