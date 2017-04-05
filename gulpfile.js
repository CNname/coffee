var gulp = require('gulp');
var sass = require('gulp-sass');
var coffee = require('gulp-coffee');
var browserSync = require('browser-sync').create();
var ts = require('gulp-typescript');
var tsOptions = require('./dev/tsconfig.json');


gulp.task('browserSync', function(){
    browserSync.init({
      port: 8082,
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
          .pipe(ts(tsOptions.compilerOptions))
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
  gulp.watch('./dev/**/*.html', ['html']).on('change', browserSync.reload); // this
  gulp.watch('./dev/sass/**/*.scss', ['sass']).on('change', browserSync.reload);
  gulp.watch(['./dev/assets/**/*.*'], ['assets']).on('change', browserSync.reload);
  gulp.watch('./dev/**/*.coffee', ['coffee']).on('change', browserSync.reload); // or this ?
  gulp.watch('./dev/**/*.ts', ['typescript']).on('change', browserSync.reload);
})

//gulp.task('default', ['html', 'sass', 'coffee', 'sass:watch', 'coffee:watch', 'html:watch', 'assets', 'assets:watch']);
gulp.task('default', ['typescript', 'html', 'sass', 'watch', 'assets' ]);
