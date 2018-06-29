define(['jquery'], function($) {
    var storage = window.localStorage;
    $('button').on('click', function() {
        var user = $('.user').val().trim();
        var pwd = $('.pwd').val().trim();
        //检测邮箱和手机号码格式是否正确 密码是为5-10的数字或字母
        var errorMes = "";
        if (user == '' || pwd == '') {
            errorMes = '用户名或密码不能为空';
        } else {
            var phonereg = /^1[34578]\d{9}$/;
            // 65618@qq.com   69456@qq.cn    51584@163.net
            var emialreg = /^\w+@\w+\.[com|cn|net]$/;
            if (!(phonereg.test(user) || emialreg.test(user))) {
                errorMes = '用户名格式有误';
            }
            var pwdreg = /[^a-z0-9]/i;
            if (pwdreg.test(pwd) || pwd.length < 5 || pwd.length > 10) {
                errorMes = '密码格式有误';
            } else {
                // 没有出现非数字和字母
                var numreg = /^\d{5,10}$/;
                var codereg = /^[a-z]{5,10}$/i;
                if (numreg.test(pwd) || codereg.test(pwd)) {
                    errorMes = '密码格式有误';
                }
            }
        }
        if (errorMes) {
            $('.tip').html(errorMes);
        } else {
            if ($(this).hasClass('log')) {
                $('.tip').html(' ');
                // 登录发送密码 
                $.ajax({
                    url: '/api/login',
                    type: 'post',
                    data: {
                        user: user,
                        pwd: pwd
                    },
                    dataType: 'json',
                    success: function(data) {
                        if (data.res) {
                            history.go(-1);
                            storage.setItem('userinfo', 1);
                        } else {
                            alert(data.mes);
                        }
                    }
                });
            } else {
                // 点击注册 
                $.ajax({
                    url: '/api/reglogin',
                    type: 'post',
                    data: {
                        user: user,
                        pwd: pwd
                    },
                    dataType: 'json',
                    success: function(data) {
                        if (data.res) {
                            alert('恭喜您注册成功！');
                        };
                    }
                });
            }
        }
    });
    // 眼睛
    $('.eye').on('click', function() {
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            $('.pwd').attr('type', 'password');
        } else {
            $('.pwd').attr('type', 'text');
        }
    });
});