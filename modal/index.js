const config = require('../config');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

function getDB() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(config.DBUrl, (err, db) => {
            assert.equal(null, err);
            resolve(db);
        });
    });
}

function queryRank(db, user, callback) {
    db.collection('users').find().sort({
        'scroe': -1
    }).toArray(function (err, users) {
        assert.equal(null, err);
        var ranks = [];
        var rank = 0;
        var score = 0;
        users.forEach(function (v, i) {
            if (v.openid == user.openid) {
                rank = i + 1;
                score = v.scroe;
            }
            if (i < 50) {
                ranks.push(v);
            }
        });
        callback(null, {
            rank: rank,
            score:score,
            users: ranks
        })
        db.close();
    });
}
module.exports = {
    queryDatas: function (callback) {
        getDB().then(db => {
            db.collection('pageview').find().toArray(function (err, pvs) {
                db.collection('users').find({
                    isShare: 1
                }).toArray((err, shares) => {
                    db.collection('users').find().sort({
                        'scroe': -1
                    }).toArray(function (err, users) {
                        callback(err, {
                            pv: pvs.length,
                            shareNum: shares.length,
                            users: users
                        })
                    });
                })
            });
        })
    },
    insertPv: function (user, callback) {
        getDB().then(db => {
            user._id = user.openid;
            db.collection('pageview').findOne({
                'openid': user.openid
            }, function (err, doc) {
                assert.equal(null, err);
                if (doc) {
                    let time = new Date().getTime();
                    user.modifyTime = time;
                    db.collection('pageview').updateOne({
                        'openid': user.openid
                    }, {
                        $set: {
                            modifyTime: time
                        }
                    }, function (err, result) {
                        assert.equal(null, err);
                        callback(err, result);
                        db.close();
                    });
                } else {
                    let time = new Date().getTime();
                    user.createTime = time;
                    user.modifyTime = time;
                    db.collection('pageview').insertOne(user, function (err, result) {
                        assert.equal(null, err);
                        callback(err, result);
                        db.close();
                    })
                }
            });

        })
    },
    insertUserScore: function (user, callback) {
        getDB().then(db => {
            user._id = user.openid;
            db.collection('users').findOne({
                'openid': user.openid
            }, (err, doc) => {
                assert.equal(null, err);
                if (doc) {
                    if (user.scroe > doc.scroe) {
                        let time = new Date().getTime();
                        user.modifyTime = time;
                        db.collection('users').updateMany({
                            'openid': user.openid
                        }, {
                            $set: {
                                modifyTime: time,
                                scroe: user.scroe
                            }
                        }, function (err, result) {
                            assert.equal(null, err);
                            queryRank(db, user, callback);
                        });
                    } else {
                        queryRank(db, user, callback);
                    }
                } else {
                    let time = new Date().getTime();
                    user.createTime = time;
                    user.modifyTime = time;
                    db.collection('users').insertOne(user, function (err, result) {
                        assert.equal(null, err);
                        queryRank(db, user, callback);
                    })
                }
            })
        })
    },
    insertUserShare: function (user, callback) {
        getDB().then(db => {
            user._id = user.openid;
            db.collection('users').findOne({
                'openid': user.openid
            }, (err, doc) => {
                assert.equal(null, err);
                if (doc) {
                    let time = new Date().getTime();
                    user.modifyTime = time;
                    db.collection('users').updateMany({
                        'openid': user.openid
                    }, {
                        $set: {
                            modifyTime: time,
                            isShare: user.isShare
                        }
                    }, function (err, result) {
                        assert.equal(null, err);
                        callback(err, result);
                        db.close();
                    });
                } else {
                    let time = new Date().getTime();
                    user.createTime = time;
                    user.modifyTime = time;
                    db.collection('users').insertOne(user, function (err, result) {
                        assert.equal(null, err);
                        callback(err, result);
                        db.close();
                    })
                }
            })
        })
    },
    insertUserInfo: function (user, callback) {
        getDB().then(db => {
            user._id = user.openid;
            user.isShare = 1;
            db.collection('users').findOne({
                'openid': user.openid
            }, (err, doc) => {
                assert.equal(null, err);
                if (doc) {
                    if (doc.name) {
                        callback(err, 'ok');
                        db.close();
                    } else {
                        let time = new Date().getTime();
                        user.modifyTime = time;
                        var data = {
                            modifyTime: time,
                            name: user.name,
                            mobile: user.mobile,
                            province: user.province,
                            city: user.city,
                            address: user.address,
                            age: user.age,
                            size: user.size
                        }
                        if (doc.isShare) {
                            data.isShare = 1;
                        }
                        db.collection('users').updateOne({
                            'openid': user.openid
                        }, {
                            $set: data
                        }, function (err, result) {
                            assert.equal(null, err);
                            callback(err, result);
                            db.close();
                        });
                    }
                } else {
                    let time = new Date().getTime();
                    user.createTime = time;
                    user.modifyTime = time;
                    db.collection('users').insertOne(user, function (err, result) {
                        assert.equal(null, err);
                        callback(err, result);
                        db.close();
                    })
                }
            })
        })
    }
}
