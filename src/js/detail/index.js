define([
    'jquery',
    'getUrl',
    'temp',
    'text!template/detail.html',
], function($, getUrl, temp, detail) {
    var $id = getUrl('id');
    $.ajax({
        url: '/api/detail?id=' + $id,
        dataType: 'json',
        success: function(data) {
            console.log(data);
            init(data)
        }
    })

    function init(data) {
        $('.header-title').html(data.item.title);
        temp(detail, data, '.main')
    }
});