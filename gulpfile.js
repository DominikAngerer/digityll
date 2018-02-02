const gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    postcss = require('gulp-postcss'),
    reporter = require('postcss-reporter'),
    syntax_scss = require('postcss-scss'),
    stylelint = require('stylelint'),
    sass = require('gulp-sass'),
    livereload = require('gulp-livereload'),
    notify = require('gulp-notify'),
    nodemon = require('nodemon');

gulp.task("sass-lint", function() {

    // Stylelint config rule

    var processors = [
        stylelint(),
        reporter({
            clearMessages: true,
            //throwError: true,
            failOnError: false
        })
    ];

    return gulp.src(
        ['./sass/**/*.scss',
        '!./sass/vendor/*.scss',
        '!./sass/main.scss']
    )
    .pipe(postcss(processors, {syntax: syntax_scss}));
});

gulp.task('sass', function() {
return gulp
    .src('./sass/main.scss')
    .pipe(sass({
        outputStyle: 'compressed'
    }))
    .pipe(gulp.dest('./public/css'));
});

// takes care of util scripts
gulp.task('utils-scripts', function() {
    return gulp
    .src('./public/js/utils/**/*.js')
    .pipe(concat('utils.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'));
});

// takes care of vendor scripts
// must explicitly list the vendor scripts file in order of build
gulp.task('vendor-scripts', function() {
    return gulp
    .src([
        './public/js/vendor/jquery.2.2.3.min.js',
        './public/js/vendor/bootstrap-select/dist/js/bootstrap-select.js',
        './public/js/vendor/bootstrap/bootstrap.min.js',
        './public/js/vendor/Camera-master/scripts/jquery.mobile.customized.min.js',
        './public/js/vendor/Camera-master/scripts/jquery.easing.1.3.js', 
        './public/js/vendor/Camera-master/scripts/camera.min.js',
        './public/js/vendor/bootstrap-mega-menu/js/menu.js',
        './public/js/vendor/WOW-master/dist/wow.min.js',
        './public/js/vendor/owl-carousel/owl.carousel.min.js',
        './public/js/vendor/jquery.appear.js',
        './public/js/vendor/jquery.countTo.js',
        './public/js/vendor/fancybox/dist/jquery.fancybox.min.js',
        './public/js/vendor/queryloader/queryLoader3.js'
    ])
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'));
});

// takes care of all site specific scripts
gulp.task('site-scripts', function() {
    return gulp
    .src([
        'public/js/source/theme.js',
        'public/js/source/storyblok.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'));
});

gulp.task('express:dev', function() {
    nodemon({
        script: 'index.js',
        ext: 'js'
    }).on('restart', function() {
        gulp.src('index.js')
            .pipe(notify('App Restarted'));
    });
});

gulp.task('hbs', function() {    
});

gulp.task('watch', function(){
    livereload.listen();
    dest = ['./public/**', './views/**'];
    gulp.watch('sass/**/*.scss', ['sass-lint']);
    gulp.watch('public/js/utils/*.js', ['utils-scripts']);
    gulp.watch('public/js/vendor/*.js', ['vendor-scripts']);
    gulp.watch('public/js/**/*.js', ['site-scripts']);
    gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch('views/**/*.hbs', ['hbs']);
    gulp.watch(dest).on('change', function(file){
        livereload.changed(file.path);
    });
});

gulp.task('serve', ['sass-lint', 'sass', 'express:dev', 'watch'], function() {
// not sure if we need this or not, but we'll keep just in case we need it for something
});

gulp.task('build', ['sass', 'utils-scripts', 'vendor-scripts', 'site-scripts'], function() {

});

gulp.task('default', ['sass-lint', 'sass', 'utils-scripts', 'vendor-scripts', 'site-scripts', 'express:dev', 'hbs', 'watch'], function() {

});
