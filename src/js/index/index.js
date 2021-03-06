define([
    'jquery',
    'temp',
    'swiper',
    'text!template/index.html',
    'text!template/block_list.html',
    'text!template/recommend_cont.html',
    'text!template/dl_list.html',
    'text!template/sift_list.html'
], function($, temp, Swiper, str, block, recome, dltext, sift) {
    var index = 0;
    // 点击书城书架切换
    $('.header span').on('click', function() {
        index = $(this).index();
        change();
    });
    // 点击切换函数
    function change() {
        $('.header span').eq(index).addClass('active').siblings().removeClass('active');
        $('.content').css({
            transform: 'translate(-' + index * 100 + '%,0)'
        });
    };
    // 渲染书架内容
    $.ajax({
        url: '/api/bookself',
        dataType: 'json',
        success: function(data) {
            initBookSelf(data);
        }
    });

    function initBookSelf(data) {
        console.log(data);
        temp(block, data.items, '.book_self_cont>div');
        $('.book_self_btn').on('click', function() {
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                temp(block, data.items, '.book_self_cont>div');
            } else {
                temp(dltext, data.items, '.book_self_cont>div');
            }
        })
    };
    // 渲染书城内容
    $.ajax({
        url: '/api/index',
        dataType: 'json',
        success: function(data) {
            initBookCity(data);
        }
    })

    function initBookCity(data) {
        // 轮播图和主结构
        temp(str, data.items[0].data, '.book_city_cont');
        new Swiper('.banner', {
            autoplay: {
                delay: 1000
            }
        });
        // 本周最火
        temp(block, data.items[1].data.data, '.week_hot');
        // 限时特惠
        data.items[5].data.data.map(function(v) {
            v.title = v.data.title;
            v.cover = v.data.cover;
            v.fiction_id = v.data.fiction_id;
        })
        temp(block, data.items[5].data.data, '.time_free');
        // 重磅推荐
        var index = 0;
        temp(recome, changedata(index, data.items[2].data.data), '.recommend_cont');
        // 女生最爱
        temp(dltext, changedata(index, data.items[3].data.data), '.gril_cont');
        // 男生最爱
        temp(dltext, changedata(index, data.items[4].data.data), '.boy_cont');
        // 精选专题
        temp(sift, data.items[6], '.sift_cont');
        // 上拉加载
        loadMore('.book_city');
        // 换一换
        $('.book_city').on('click', '.change_btn', function() {
            var index = $(this).data('id') * 1;
            var ind = $(this).attr('data');
            var obj = data.items[ind];
            index++;
            index = index % (obj.data.count / 5);
            $(this).data('id', index);
            var str = ind == 2 ? recome : dltext;
            temp(str, changedata(index, obj.data.data), '.' + $(this).prev().attr('class'));
        });

    }

    function changedata(ind, arr) {
        var limit = 5;
        var startind = ind * limit;
        var endind = ind * limit + limit;
        var newarr = arr.slice(startind, endind);
        newarr.map(function(v, i) {
            v.count = i + 1;
        });
        return newarr;
    }
    // 页码
    var pagenum = 0;

    function loadMore(parent) {
        if (pagenum >= 3) {
            $('.loading').html('暂无更多数据');
            return false;
        }
        // 可视区域的高度
        var clientH = $(parent).height();
        $(parent).on('scroll', function() {
            // 最大滚动距离
            var maxH = $(this).children().height() - clientH;
            if ($(this).scrollTop() + 40 >= maxH) {
                $(this).off('scroll');
                pagenum++;
                render(pagenum)
            }
        })
    }

    function render(n) {
        $.ajax({
            url: "/api/loadmore",
            data: {
                pagenum: n,
                limit: 20
            },
            dataType: 'json',
            success: function(data) {
                temp(dltext, data.items, '.load_cont_list', 1);
                loadMore('.book_city');
            }
        })
    }
});