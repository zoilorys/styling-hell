var gulp = require('gulp');
var less = require('gulp-less');
var rename = require('gulp-rename');
var Prefixer = require('less-plugin-autoprefix');

var config = require('./config.json');

gulp.task('less', function() {
    return gulp.src('src/main.less')
        .pipe(less({
            plugins: [
                new Prefixer({ browsers: ['last 2 versions'] })
            ]
        }))
        .pipe(rename(config.targetName))
        .pipe(gulp.dest(config.targetPath));
});

gulp.task('watch', ['default'], function() {
    gulp.watch(['src/*.less'], ['default']);
});

gulp.task('default', ['less']);