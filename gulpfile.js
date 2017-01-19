'use strict';
var gulp 	    = require('gulp'),
    prefixer    = require('gulp-autoprefixer'),
    csso        = require('gulp-csso'). 
    imagemin    = require('gulp-imagemin'),
    server      = require('gulp-server-livereload'),
    sass        = require('gulp-sass'),
    uglify      = require('gulp-uglify'),
    watch       = require('gulp-watch'),
    gulpif      = require('gulp-if'),
    htmlmin     = require('gulp-htmlmin'),
    clean       = require('gulp-dest-clean'),
    useref      = require('gulp-useref');
    
/*  Paths   */
var path = {
        build: {
            html: 'build/',
            js: 'build/js/',
            css: 'build/css/',
            img: 'build/img/',
            fonts: 'build/fonts/'
        },
        app: {
            html: 'app/*.html',
            js: 'app/js/main.js',
            style: 'app/sass/main.sass',
            img: 'app/img/**/*.*',
            fonts: 'app/fonts/**/*.*',
            css: "app/css/"
        },
        watch: {
            html: 'app/**/*.html',
            js: 'app/js/**/*.js',
            style: 'app/sass/**/*.sass',
            img: 'app/img/**/*.*',
            fonts: 'app/fonts/**/*.*'
        },
        clean: './build'
};

/*  Tasks   */
//clean
gulp.task('clean', function (cb) {
    clean(path.clean, cb);
});

//server
gulp.task('webserver', function() {
  gulp.src('app')
    .pipe(server({
      livereload: true,
      open: true
    }));
});

//style
gulp.task('style', function(){
  return gulp.src(path.app.style)
    .pipe(sass().on('error', sass.logError))
    .pipe(prefixer())
    .pipe(gulp.dest(path.app.css));
});

//images
gulp.task('image', function () {
    gulp.src(path.app.img) 
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(path.build.img))
});

//fonts
gulp.task('fonts', function() {
    gulp.src(path.app.fonts)
        .pipe(gulp.dest(path.build.fonts))
});


//build
gulp.task('build', function () {
    return gulp.src('app/*.html')
        .pipe(clean(path.clean))
        .pipe(useref())
        .pipe(gulpif('*.min.js', uglify()))
        .pipe(gulpif('*.min.css', csso()))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'));
});


gulp.task('default', function() {  
    gulp.run('webserver', 'style');

    gulp.watch(['app/sass/**/*.sass'], function(event) {
        gulp.run('style');
    })
})