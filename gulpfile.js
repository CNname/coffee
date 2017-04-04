var gulp = require('gulp');
var sass = require('gulp-sass');
var coffee = require('gulp-coffee');
var livereload = require('gulp-livereload');

gulp.task('html', function(){
  return gulp.src(['./dev/index.html'])
  .pipe(gulp.dest('./dist'));
});

gulp.task('coffee', function() {
  return gulp.src('./dev/*.coffee', { sourcemaps: true })
    .pipe(coffee({ bare: true }))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('sass', function () {
  return gulp.src('./dev/sass/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('sass:watch', function () {
  livereload.listen();
  gulp.watch('./dev/sass/**/*.scss', ['sass']);
});

gulp.task('coffee:watch', function() {
  livereload.listen();
  gulp.watch('./dev/*.coffee', ['coffee']);
})

gulp.task('html:watch', function(){
  livereload.listen();
  gulp.watch('./dev/index.html', ['html']);
});

gulp.task('assets', function(){
  return gulp.src(['./dev/assets/**/*.*'])
  .pipe(gulp.dest('./dist/assets'));
});

gulp.task('assets:watch', function(){
  livereload.listen();
  gulp.watch(['./dev/assets/**/*.*'], ['assets'])
});

gulp.task('default', ['html', 'sass', 'coffee', 'sass:watch', 'coffee:watch', 'html:watch', 'assets', 'assets:watch']);
