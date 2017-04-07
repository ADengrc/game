(function (window) {
    $('.page1 .ruleBtn').click(function () {
        $('.page').hide();
        $('.page2').show();
    });
    $('.btns .start').click(function () {
        $('.page').hide();
        $('.page3').show();
        var isStart = window.localStorage.getItem('isStart');
        if (!isStart) {
            window.localStorage.setItem('isStart', 1);
            $('.page3 .demo').show();
            $('.page3 .demo .know').click(function () {
                $('.page3 .demo').hide();
                window.startGame();
            });
        } else {
            window.startGame();
        }
    });
    $('.page4 .showBtn').click(function () {
        $('.page').hide();
        $('.page6').show();
    });
    $('.page4 .continueBtn').click(function () {
        $('.page').hide();
        $('.page3').show();
        window.startGame();
    });
    $('.page4 .infoBtn').click(function () {
        $('.page').hide();
        $('.page5').show();
    });
    $('.page5 button').click(function () {
        var name = $('#name').val().trim(),
            mobile = $('#mobile').val().trim(),
            province = $('#demo1').val().trim().split(',')[0] || '',
            city = $('#demo1').val().trim().split(',')[1] || '',
            address = $('#address').val().trim(),
            age = $('#age').val().trim(),
            size = $('#size').val().trim();
        if (name == '' || mobile == '' || province == '' || city == '' || address == '' || age == '' || size == '') {
            if ($('.alert').length > 0) return;
            $('<div class="alert">请完善个人信息</div>').appendTo($('body'));
            setTimeout(function () {
                $('.alert').remove();
            }, 2000);
            return;
        }
        REST.setUserInfo({
            name: name,
            mobile: mobile,
            province: province,
            city: city,
            address: address,
            age: age,
            size: size
        }, function (res) {
            if (res.code == '1') {
                $('.page').hide();
                $('.page1').show();
            }
        });
    });
})(window);
