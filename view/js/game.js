(function (window, document) {
    //奖品初始化
    var prizes = {
        pack: [20, new Image(), 50],
        logo: [20, new Image(), 100],
        boom: [10, new Image(), -50],
        red: [50, new Image(), 10]
    };
    prizes.logo[1].src = './images/prize_0.png';
    prizes.logo[1].width = px(204);
    prizes.logo[1].height = px(97);
    prizes.pack[1].src = './images/prize_1.png';
    prizes.pack[1].width = px(117);
    prizes.pack[1].height = px(147);
    prizes.red[1].src = './images/prize_2.png';
    prizes.red[1].width = px(134);
    prizes.red[1].height = px(123);
    prizes.boom[1].src = './images/prize_3.png';
    prizes.boom[1].width = px(76);
    prizes.boom[1].height = px(116);

    var prizeRand = function (oArr) {
        var sum = 0; // 总和
        var rand = 0; // 每次循环产生的随机数
        var result = 0; // 返回的对象的key
        // 计算总和
        for (var i in oArr) {
            sum += oArr[i][0];
        }
        // 思路就是如果设置的数落在随机数内，则返回，否则减去本次的数
        for (var i in oArr) {
            rand = Math.floor(Math.random() * sum + 1);
            if (oArr[i][0] >= rand) {
                result = {
                    image: oArr[i][1],
                    type: i,
                    value: oArr[i][2]
                };
                break;
            } else {
                sum -= oArr[i][0];
            }
        }
        return result;
    }

    var Sprite = function () {
        this.x = 0;
        this.y = 0;
        this.image = new Image();
    };

    var PrizeSprite = function () {
        var obj = prizeRand(prizes);
        obj.x = 0;
        obj.y = 0;
        return obj;
    };

    var canvas = document.createElement('canvas');
    canvas.height = window.screen.height * window.dpr;
    canvas.width = window.screen.width * window.dpr;
    $('.page3').append(canvas);
    var ctx = canvas.getContext('2d');
    var bgTop = new Image(),
        bgBottom = new Image(),
        kidImg = new Image(),
        Kid = new Sprite();
    //灯笼
    bgTop.src = './images/bg_top.png';
    bgTop.width = px(313);
    bgTop.height = px(419);
    bgTop.onload = function () {}
    //雪地
    bgBottom.src = './images/bg_bottom.png';
    bgBottom.width = px(750);
    bgBottom.height = px(445);
    bgBottom.onload = function () {}
    //小孩
    kidImg.src = './images/kid_1.png';
    kidImg.width = px(205);
    kidImg.height = px(306);
    kidImg.onload = function () {
        Kid.image = this;
        Kid.y = canvas.height + 80 - bgBottom.height - (canvas.height - document.body.clientHeight);
        Kid.x = px(750) / 2 - Kid.image.width / 2;
        ctx.drawImage(bgTop, 0, 0, bgTop.width, bgTop.height);
        ctx.drawImage(bgBottom, 0, canvas.height - bgBottom.height - (canvas.height - document.body.clientHeight), bgBottom.width, bgBottom.height);
        ctx.drawImage(Kid.image, Kid.x, canvas.height + 80 - bgBottom.height - (canvas.height - document.body.clientHeight), kidImg.width, kidImg.height);
    }

    //移动小孩
    var move = function (event) {
        event = event.touches[0];
        Kid.x = event.clientX - kidImg.width / 10;
        if (Kid.x + kidImg.width >= canvas.width) Kid.x = canvas.width - kidImg.width;
        else if (Kid.x <= kidImg.width / 10) Kid.x = 0;
    }

    var start = window.start = function () {
        var prizeSprites = [];
        var shi = 0;
        var h = 5;
        var chi = 0;
        //速度
        var speed = 5;
        //加速
        var FREQ = 10;
        //倒计时
        var countdown = 60;
        var remainTime = 0;
        //获得的物品
        var getPrizes = [];
        //汇总
        var prizeSummary = {};
        //速度控制
        var speedCtrl = function () {
            if (speed < 25) {
                speed = 5 + (60 - remainTime) / 3;
            }
            FREQ += parseInt(speed / 10);
        }

        var prize = function () {
            if (shi % h == 0) {
                for (var j = 2 * chi; j < 2 * (chi + 1); j++) {
                    prizeSprites[j] = PrizeSprite();
                    var range = canvas.width - prizeSprites[j].image.width;
                    var i = Math.round(Math.random() * range);
                    if (j == 2 * chi + 1) {
                        while (Math.abs(i - prizeSprites[2 * chi].x) < prizeSprites[j].image.width) {
                            i = Math.round(Math.random() * range);
                        }
                    }
                    var k = Math.round(Math.random() * 100);
                    prizeSprites[j].x = i;
                    prizeSprites[j].y = -Math.round(Math.random() * 300);
                }
                chi++;
                if (chi == FREQ) chi = 0;
            }
            shi++;
        };

        //下落
        var dram = function () {
            speedCtrl();
            for (var i = 0; i < prizeSprites.length; i++) {
                if (crash(Kid, prizeSprites[i])) {
                    getPrizes.push(prizeSprites[i]);
                    prizeSprites[i].y += px(1334);
                    (function (prize) {
                        var num = $('<div class="num">' + (prize.value > 0 ? '+' + prize.value : prize.value) + '</div>').css({
                            'left': Kid.x,
                            'top': Kid.y
                        }).appendTo($('.page3'));
                    })(prizeSprites[i]);
                } else {
                    prizeSprites[i].y += speed;
                }
                ctx.drawImage(prizeSprites[i].image, prizeSprites[i].x, prizeSprites[i].y, prizeSprites[i].image.width, prizeSprites[i].image.height);
            }
        }
        //碰撞
        var crash = function (kid, prize) {
            var x = kid.x - prize.x;
            var y = kid.y - prize.y;
            if (x < prize.image.width && x > -kid.image.width && y < prize.image.height && y > -kid.image.height) {
                return true;
            } else {
                return false;
            }
        }
        var summary = function () {
            var count = 0;
            getPrizes.forEach(function (prize) {
                if (prizeSummary[prize.type]) {
                    prizeSummary[prize.type].count += prize.value;
                    prizeSummary[prize.type].num += 1;
                } else {
                    prizeSummary[prize.type] = {
                        image: prize.image,
                        value: prize.value,
                        count: prize.value,
                        num: 1
                    }
                }
                count += prize.value;
            });
            var startBg = $('<div class="startBg"><img class="logo" src="./images/logo.png"></div>').appendTo($('body'));
            for (var i in prizeSummary) {
                var div = $('<div class="item"></div>');
                div.append(prizeSummary[i].image);
                div.append($('<span>*' + prizeSummary[i].num + '=' + prizeSummary[i].count + '</span>'));
                startBg.append(div);
            }
            startBg.append($('<div class="item">总成绩：' + count + '</div>'));
            // if(count<2000){
            //     startBg.append($('<div class="item">还要继续加油哦~</div>'));
            // }else if(count>=2000&&count<=5000){
            //     startBg.append($('<div class="item">厉害了Word宝宝</div>'));
            // }else if(count>5000){
            //     startBg.append($('<div class="item">大神，请收下我的膝盖</div>'));
            // }
            setTimeout(function () {
                REST.scroe(count, function (res) {
                    if (res && res.code == '1') {
                        $('.page').hide();
                        $('.page4').show();
                        if (res.rank > 50) {
                            $('.page4 .infoBtn').hide();
                        }
                        $('.userInfo .avatar').css('background-image', 'url(' + window.userInfo.headimgurl + ')');
                        $('.userInfo .name').text(window.userInfo.nickname);
                        $('.userInfo .scroe').text('您的总成绩为' + res.score);
                        $('.userInfo .rank').text('目前排名' + res.rank);
                        $('.rankBg .ranks').empty();
                        res.users.forEach(function (user, i) {
                            if (i < 50) {
                                $('<div class="rank"><div class="nickname">' + user.nickname + '</div><div>' + user.scroe + '</div><div>' + (i + 1) + '</div></div>').appendTo($('.rankBg .ranks'));
                            }
                        });
                        $('body>.startBg').remove();
                    }
                });
            }, 3000);
        };

        var startTime = new Date().getTime();
        var checkTime = function () {
            var nowTime = new Date();
            remainTime = countdown - parseInt((nowTime.getTime() - startTime) / 1000);
            $('.countdown').text('倒计时：' + remainTime + '秒');
            if (remainTime == 0) {
                return true;
            }
        }
        var dramPrize = setInterval(function () {
            prize();
        }, 100);
        var interval = setInterval(function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(bgTop, 0, 0, bgTop.width, bgTop.height);
            ctx.drawImage(bgBottom, 0, canvas.height - bgBottom.height - (canvas.height - document.body.clientHeight), bgBottom.width, bgBottom.height);
            if (!checkTime()) {
                dram();
            } else {
                clearInterval(dramPrize);
                clearInterval(interval);
                $('.page3 .num').remove();
                summary();
            }
            ctx.drawImage(Kid.image, Kid.x, Kid.y, kidImg.width, kidImg.height);
        }, 16);
    }
    window.startGame = function () {
        var startText = [3, 2, 1, '开始'];
        var startTextIndex = 0;
        $('<div class="startBg"></div>').appendTo($('body')).text(startText[startTextIndex]);
        var iv = setInterval(function () {
            startTextIndex++;
            if (startTextIndex === 4) {
                $('.startBg').remove();
                clearInterval(iv);
                start();
                return;
            }
            $('.startBg').text(startText[startTextIndex]);
        }, 1000);
    }
    // startGame();
    canvas.addEventListener('touchmove', move);
})(window, document);
