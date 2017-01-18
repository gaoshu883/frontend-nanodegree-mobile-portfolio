var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  cleanCSS = require('gulp-clean-css'),
  htmlmin = require('gulp-htmlmin'),
  imageResize = require('gulp-image-resize'),
  rename = require('gulp-rename'),
  imagemin = require('gulp-imagemin'),
  pump = require('pump');

//Paths to various files
var paths = {
  scripts: ['js/*.js'],
  styles: ['css/*.css'],
  smallImage: ['img/pizzeria.jpg'],
  mediumImage: ['img/mobilewebdev.jpg'],
  largeImage: ['img/pizzeria.jpg'],
  minifyImage: ['img/2048.png', 'img/cam_be_like.jpg', 'img/pizza.png'],
  lowQImage: ['img/profilepic.jpg', 'img/wpo.jpg', 'img/build_2048.jpg', 'img/mwd.jpg'],
  contents: ['*.html']
};

//Minifies js files
gulp.task('scripts', function(cb) {
  pump([
        gulp.src(paths.scripts),
        uglify(),
        rename({
              suffix: "-min"
            }),
        gulp.dest('./dist/js/')
    ],
    cb
  );
});

//Minifies CSS files
gulp.task('styles', function() {
  return gulp.src(paths.styles)
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: "-min"
    }))
    .pipe(gulp.dest('./dist/css/'));
});

// Minifies our HTML files
gulp.task('contents', function() {
  return gulp.src(paths.contents)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(rename({
      suffix: "-min"
    }))
    .pipe(gulp.dest('./dist/'));
});

// Optimizes our image files
gulp.task('smallImage', function() {
  return gulp.src(paths.smallImage)
    .pipe(imageResize({
      width: 100
    }))
    .pipe(imagemin())
    .pipe(rename({
      suffix: "-100-min"
    }))
    .pipe(gulp.dest('./dist/image'));
});

gulp.task('mediumImage', function() {
  return gulp.src(paths.mediumImage)
    .pipe(imageResize({
      width: 600
    }))
    .pipe(imagemin())
    .pipe(rename({
      suffix: "-600-min"
    }))
    .pipe(gulp.dest('./dist/image'));
});

gulp.task('largeImage', function() {
  return gulp.src(paths.largeImage)
    .pipe(imageResize({
      width: 720
    }))
    .pipe(imagemin())
    .pipe(rename({
      suffix: "-720-min"
    }))
    .pipe(gulp.dest('./dist/image'));
});
gulp.task('minifyImage', function() {
  return gulp.src(paths.minifyImage)
    .pipe(rename({
      suffix: "-min"
    }))
    .pipe(gulp.dest('./dist/image'));
});

gulp.task('lowQImage', function() {
  return gulp.src(paths.lowQImage)
    .pipe(imageResize({
      quality: 0.6
    }))
    .pipe(imagemin())
    .pipe(rename({
      suffix: "-0.6-min"
    }))
    .pipe(gulp.dest('./dist/image'));
});

//监听js文件的改动，并执行scripts任务
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('images', ['smallImage', 'mediumImage', 'largeImage', 'minifyImage', 'lowQImage']);

gulp.task('cj', ['styles', 'scripts']);

gulp.task('h', ['contents']);

gulp.task('cji', ['styles', 'scripts', 'images']);

gulp.task('default', ['styles', 'scripts', 'contents', 'images']);
