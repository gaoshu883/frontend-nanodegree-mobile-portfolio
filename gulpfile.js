var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  cleanCSS = require('gulp-clean-css'),
  htmlmin = require('gulp-htmlmin'),
  imageResize = require('gulp-image-resize'),
  rename = require('gulp-rename'),
  imagemin = require('gulp-imagemin'),
  uncss = require('gulp-uncss'),
  inlinesource = require('gulp-inline-source'),
  gulpSequence = require('gulp-sequence'),
  pump = require('pump');

//Paths to various files
var paths = {
  scripts: ['src/js/*.js'],
  styles: ['src/css/*.css'],
  smallImage: ['src/image/pizzeria.jpg'],
  mediumImage: ['src/image/mobilewebdev.jpg'],
  largeImage: ['src/image/pizzeria.jpg'],
  minifyImage: ['src/image/2048.png', 'src/image/pizza.png'],
  lowQImage: ['src/image/profilepic.jpg', 'src/image/cam_be_like.jpg', 'src/image/wpo.jpg', 'src/image/build_2048.jpg', 'src/image/mwd.jpg'],
  camContents: ['src/index.html', 'src/project-2048.html', 'src/project-mobile.html', 'src/project-webperf.html'],
  pizzaContent: ['src/pizza.html'],
  contents: ['src/*.html']
};

//Minifies js files
gulp.task('scripts', function(cb) {
  pump([
      gulp.src(paths.scripts),
      uglify(),
      gulp.dest('./dist/js/')
    ],
    cb
  );
});

//Minifies CSS files
gulp.task('styles', function() {
  return gulp.src(paths.styles)
    .pipe(cleanCSS())
    .pipe(gulp.dest('./dist/css/'));
});

//移动HTML文件
gulp.task('minifyHTML', function() {
  return gulp.src(paths.contents)
    .pipe(htmlmin({
      collapseWhitespace: true,
      minifyJS: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./dist/'));
});

//将CSS文件内联到HTML中
gulp.task('inlinesource', function() {
  return gulp.src('dist/*.html')
    .pipe(inlinesource())
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
      suffix: "-100"
    }))
    .pipe(gulp.dest('./dist/image'));
});

gulp.task('mediumImage', function() {
  return gulp.src(paths.mediumImage)
    .pipe(imageResize({
      width: 600
    }))
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/image'));
});

gulp.task('largeImage', function() {
  return gulp.src(paths.largeImage)
    .pipe(imageResize({
      width: 720
    }))
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/image'));
});
gulp.task('minifyImage', function() {
  return gulp.src(paths.minifyImage)
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/image'));
});

gulp.task('lowQImage', function() {
  return gulp.src(paths.lowQImage)
    .pipe(imageResize({
      quality: 0.8
    }))
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/image'));
});

gulp.task('images', ['smallImage', 'mediumImage', 'largeImage', 'minifyImage', 'lowQImage']);

gulp.task('contents', gulpSequence('minifyHTML', 'inlinesource'));

gulp.task('default', gulpSequence(['scripts','styles','images'], 'contents'));

//监听js CSS文件的改动，并执行scripts styles任务
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.styles, function (event) {
    gulpSequence('styles', 'inlinesource')(function (err) {
      if (err) console.log(err);
    });
  });
  gulp.watch(paths.contents, ['contents']);
});
