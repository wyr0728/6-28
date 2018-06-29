define([
    'jquery',
    'getUrl',
    'temp'
],function($,getUrl,temp){
   var bookid = getUrl('id');
       activeid = getUrl('active');
       console.log(bookid,activeid);
    $.ajax({
        url:'/api/chapter',
        dataType:'json',
        success:function(data){
            console.log(data.item.toc)
         temp($('.text').html(),data.item.toc,'.list');
        }
    })
})