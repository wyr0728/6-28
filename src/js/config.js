require.config({
    baseUrl: '/js/',
    paths: {
        jquery: 'lib/jquery',
        zepto: 'lib/zepto',
        index: 'index/index',
        text: 'lib/require.text',
        template: '../template/',
        handlebars: 'lib/handlebars',
        temp: 'common/temp',
        swiper: 'lib/swiper',
        search: 'search/index',
        detail: 'detail/index',
        getUrl: 'common/getUrl',
        menu: 'menu/index',
        text1:'text/index',
        base64:'lib/jquery.base64',
        login: 'login/index'
    },
    shim:{
        lazyload:{
            exports:'laztload',
            deps:['jquery']
        },
        base64: {
            exports:'base64',
            deps:['jquery']
        }
    }
})