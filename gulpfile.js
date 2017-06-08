/**
 * Created by gaozhaopeng on 2017/3/7.
 */
'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var ts = require("gulp-typescript");
var spriter = require('gulp-css-spriter');
var connect = require('gulp-connect');
var Proxy = require('gulp-connect-proxy');
var cssmin = require('gulp-minify-css');
var reload = browserSync.reload;
gulp.task('sass', function () {
    return gulp.src('src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dest/css/'))
        .pipe(reload({ stream:true }));
});
gulp.task('cssmin',function(){
	  gulp.src('dest/css/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('app/css'));
});
gulp.task('copy:img',  function() {
    return gulp.src('src/images/*')
        .pipe(gulp.dest('dest/images'))
});
gulp.task('js-min',function(){
    gulp.src('dest/js/*.js')
        .pipe(uglify())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('app/js'));
});
gulp.task('css-sprit', function() {
    return gulp.src('milk/css/index.css')
        .pipe(spriter({
            'spriteSheet': 'milk/images/spritesheet.png', 
            'pathToSpriteSheetFromCSS': 'milk /images/spritesheet.png' 
        }))
        .pipe(gulp.dest('milk/css'));
});
gulp.task('serve:dest', function() {
    browserSync({
        server: { 
            baseDir: 'dest'
        }
    });
    gulp.watch("dest/**/*.html").on("change", browserSync.reload);
    gulp.watch('src/scss/**/*.scss', ['ssa']);
});
gulp.task("default", function () {
    var tsResult = gulp.src("src/ts/*.ts")
        .pipe(ts({
            noImplicitAny: true,
        }));
    return tsResult.js.pipe(gulp.dest('dest/js'));
});
gulp.task('serve:app',function(){
	browserSync({
        server: { 
            baseDir: 'app'
        }
    });
});
gulp.task("server:proxy", function () {
    connect.server({
        root: "dest",
        port: 8000,
        livereload: true,
        middleware: function (connect, opt) {
            opt.route = '/proxy';
            var proxy = new Proxy(opt);
            return [proxy];
        }
    });
});