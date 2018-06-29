define([
    'jquery',
    'temp',
    'text!template/dl_list.html'
], function($, temp, dltext) {
    // 历史记录
    var storage = window.localStorage;
    var searchdata = JSON.parse(storage.getItem('searchinfo')) || [];
    searchinfo();
    // 初始显示页面
    $.getJSON('/api/searchKey').done(render);

    function render(data) {
        temp($('.text').html(), data, '.search_cont')
    };
    // 点击搜索
    $('.btn').on('click', function() {
        var inp = $(this).prev();
        var val = inp.val();
        if (val != '') {
            searchdata.unshift(val);
            storage.setItem('searchinfo', JSON.stringify(searchdata));
            searchinfo()
            $.getJSON('/api/result', { value: val }, function(data) {
                // 渲染搜索结果
                if (data.mes == 'success') {
                    temp(dltext, data.cont, '.search_cont')
                } else {
                    $('.search_cont').html(data.mes);
                }
            })
        }
    });

    function searchinfo() {
        temp($('.remove').html(), searchdata, '.history_list');
    }
    // 删除搜索记录
    $('.history_list').on('click', '.remove', function() {
        var ind = $(this).data('ind');
        searchdata.splice(ind, 1);
        storage.setItem('searchinfo', JSON.stringify(searchdata));
        searchinfo();
    })
});