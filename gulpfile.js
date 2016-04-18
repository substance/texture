'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var through2 = require('through2');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var argv = require('yargs').argv;

gulp.task('lint', function() {
  return gulp.src([
    './app/**/*.js',
    './reader/**/*.js',
    './writer/**/*.js',
    './converter/**/*.js'
  ]).pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter("fail"));
});

gulp.task('app:assets', function () {
  gulp.src('./index.html')
    .pipe(gulp.dest('./dist'));
  // Assets
  gulp.src('./styles/assets/**/*')
    .pipe(gulp.dest('./dist/assets'));

  // Font Awesome
  gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('app:css', function() {
  gulp.src('./app/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('app.css'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('app:js', function() {
  gulp.src('./app/app.js')
    .pipe(through2.obj(function (file, enc, next) {
        browserify(file.path)
        .bundle(function (err, res) {
          if (err) { return next(err); }
          file.contents = res;
          next(null, file);
        });
    }))
    .on('error', function (error) {
        console.log(error.stack);
        this.emit('end');
    })
    .pipe(uglify().on('error', function(err){console.log(err); }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['lint', 'app:assets', 'app:css', 'app:js']);

gulp.task('default', ['build']);
