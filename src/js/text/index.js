define([
    'jquery',
    'temp',
    'getUrl',
    'base64',
], function($, temp, getUrl) {
    var storage = window.localStorage;
    // 默认显示第一章
    var chapterId = getUrl('curchapter') || storage.getItem('chapterId') * 1 || 1;
    var fontSize = storage.getItem('fontSize') || 20;
    var contentBg = storage.getItem('contentBg') || '#fff';
    $('.content').css('fontSize', fontSize * 1);
    $('.content').css('background-color', contentBg);
    var bgcolor = [{
        color: '#f7eee5'
    }, {
        color: '#e9dfc7'
    }, {
        color: '#a4a4a4'
    }, {
        color: '#cdefce'
    }, {
        color: '#283548'
    }];
    temp($('.bgcolor').html(), bgcolor, '.bgcolor-cont');
    getText();
    // 获取总章节
    var chaptersum = getUrl('chaptersum');
    $('.sum').html(chaptersum);
    // 点击文字显示菜单
    $('.content').on('click', function() {
        $('.menu').show();
    });
    $('.menu').on('click', function() {
        $(this).hide();
        $('.config-box').hide();
    });
    // 点击上一章
    $('.prev-btn').on('click', function() {
        chapterId--;
        chapterId = chapterId <= 1 ? 1 : chapterId;
        getText();
        return false;
    });
    // 点击下一章
    $('.next-btn').on('click', function() {
        chapterId++;
        chapterId = chapterId >= chaptersum ? chaptersum : chapterId;
        getText();
        return false;
    });
    // 点击目录
    $('.menu-btn').on('click', function() {
        window.location.href = 'menu.html?id=' + getUrl('id') + '&active=' + chapterId;
    });
    // 点击字体
    $('.typeface').on('click', function() {
        $('.config-box').toggle();
        return false;
    });
    // 点击字体大小
    $('.config-box').on('click', 'button', function() {
        fontSize = parseInt($('.content').css('fontSize'));
        if ($(this).html() === '大') {
            $('.content').css('fontSize', ++fontSize);
        } else {
            $('.content').css('fontSize', --fontSize);
        }
        storage.setItem('fontSize', fontSize);
        return false;
    });
    // 点击背景色
    $('.bgcolor-cont').on('click', 'b', function() {
        contentBg = $(this).css('background-color');
        storage.setItem('contentBg', contentBg);
        $('.content').css('background-color', contentBg);
        return false;
    });
    // 获取章节文本
    function getText() {
        storage.setItem('chapterId', chapterId);
        $.ajax({
            url: '/api/reader',
            data: {
                chapterNum: chapterId
            },
            dataType: 'json',
            success: function(data) {
                $('.cur').html(chapterId);
                jsonp(data.jsonp, function(data) {
                    var data = JSON.parse($.base64().decode(data));
                    temp($('.text').html(), data, '.content');
                });
            }
        });
    };

    function jsonp(url, success) {
        var script = document.createElement('script');
        window['duokan_fiction_chapter'] = function(data) {
            success(data);
            document.head.removeChild(script);
        }
        script.src = url;
        document.head.appendChild(script);
    }
});