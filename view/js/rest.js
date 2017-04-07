;
(function (window, $) {
    window.shareData = {
        title: '财神到接财神之新春红包大战', // 分享标题
        desc: '我正在参与新春红包大战的游戏，金山银山，一起挑战，一起分享吧。', // 分享标题
        link: 'http://besuper.36tai.com', // 分享链接
        imgUrl: 'http://besuper.36tai.com/images/icon.jpg', // 分享图标
        success: function () {
            REST.share(function () {
                $('.page').hide();
                $('.page4').show();
            });
        },
        cancel: function () {
            $('.page').hide();
            $('.page4').show();
        }
    };
    var getParams = function (sVar) {
        return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    }
    var code = getParams("code");
    window.userInfo = null;
    var userInfo = {};
    try {
        userInfo = JSON.parse(window.localStorage.getItem('userInfo')) || {};
    } catch (err) {

    }
    $.get('/sign?url=' + encodeURIComponent(location.href), function (res) {
        if (res.sign) {
            wx.config(res.sign);
            wx.ready(function () {
                wx.onMenuShareTimeline(window.shareData);
                wx.onMenuShareAppMessage(window.shareData);
                var audio = document.createElement('audio');
                audio.src = './audio/bg.mp3';
                audio.style.display = 'none';
                audio.loop = 'loop';
                audio.preload = 'preload';
                audio.addEventListener('canplaythrough', function () {
                    audio.play();
                }, false);
                document.body.appendChild(audio);
                audio.play();
            });
        }
    })
    if (userInfo.openid) {
        window.userInfo = userInfo;
    } else {
        $.get('/user?code=' + code, function (res) {
            if (res.userInfo.openid) {
                window.userInfo = res.userInfo;
                window.localStorage.setItem('userInfo', JSON.stringify(window.userInfo));
                $.ajax({
                    url: '/pv',
                    type: 'POST',
                    data: JSON.stringify(window.userInfo),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (res) {}
                });
            }
        });
    }
    window.REST = {
        scroe: function (scroe, callback) {
            $.ajax({
                url: '/scroe',
                type: 'POST',
                data: JSON.stringify($.extend({
                    scroe: scroe
                }, window.userInfo)),
                dataType: 'json',
                contentType: 'application/json',
                success: function (res) {
                    callback(res);
                }
            });
        },
        share: function (callback) {
            $.ajax({
                url: '/share',
                type: 'POST',
                data: JSON.stringify($.extend({
                    isShare: 1
                }, window.userInfo)),
                dataType: 'json',
                contentType: 'application/json',
                success: function (res) {
                    callback(res);
                }
            });
        },
        setUserInfo: function (data, callback) {
            $.ajax({
                url: '/userInfo',
                type: 'POST',
                data: JSON.stringify($.extend(data, window.userInfo)),
                dataType: 'json',
                contentType: 'application/json',
                success: function (res) {
                    callback(res);
                }
            });
        }
    }
})(window, $)
