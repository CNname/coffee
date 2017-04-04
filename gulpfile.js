var gulp = require('gulp');
var sass = require('gulp-sass');
var coffee = require('gulp-coffee');
var browserSync = require('browser-sync').create();
var ts = require('gulp-typescript');

gulp.task('browserSync', function(){
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
    });
});

gulp.task('html', function(){
  return gulp.src(['./dev/index.html'])
  .pipe(gulp.dest('./dist'));
});

gulp.task('coffee', function() {
  return gulp.src('./dev/*.coffee', { sourcemaps: true })
    .pipe(coffee({ bare: true }))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('typescript', function(){
  return gulp.src('./dev/**/*.ts')
          .pipe(ts({
              noImplicitAny: true,
              out: 'output.js'
          }))
          .pipe(gulp.dest('./dist/js'));
});

gulp.task('sass', function () {
  return gulp.src('./dev/sass/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
});


gulp.task('assets', function(){
  return gulp.src(['./dev/assets/**/*.*'])
  .pipe(gulp.dest('./dist/assets'));
});

gulp.task('watch', ['browserSync', 'sass', 'typescript'], function(){
  gulp.watch('./dev/**/*.html').on('change', browserSync.reload)
  gulp.watch('./dev/sass/**/*.scss', ['sass']);
  gulp.watch(['./dev/assets/**/*.*'], ['assets'])
  gulp.watch('./dev/**/*.coffee', ['coffee'], browserSync.reload);
  gulp.watch('./dev/**/*.ts', ['typescript'], browserSync.reload);
})

//gulp.task('default', ['html', 'sass', 'coffee', 'sass:watch', 'coffee:watch', 'html:watch', 'assets', 'assets:watch']);
gulp.task('default', ['watch']);
