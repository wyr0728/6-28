var gulp = require('gulp');
var server = require('gulp-webserver');
var url = require('url');
var path = require('path');
var fs = require('fs');
var mock = require('./mock/');

gulp.task('server', function() {
    gulp.src('src')
        .pipe(server({
            port: 6789,
            host: 'localhost',
            open: true,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                pathname = pathname === '/' ? '/index.html' : pathname;
                if (req.url == '/favicon.ico') {
                    return false;
                };
                if (/\/api\//.test(pathname)) {
                   // if(pathname === 'api/')
                    res.end(JSON.stringify(mock(req.url)));
                } else {
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                }
            }
        }))
})

gulp.task('default', ['server']);