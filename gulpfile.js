'use strict';
/* eslint-disable no-console, no-invalid-this */

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var through2 = require('through2');
var rename = require('gulp-rename');
var eslint = require('gulp-eslint');

var examples = ['writer'];

gulp.task('assets', function () {
  examples.forEach(function(exampleFolder) {
    gulp.src('./examples/'+exampleFolder+'/index.html')
          .pipe(gulp.dest('dist/'+exampleFolder));
  });
});

gulp.task('sass', function() {
  examples.forEach(function(exampleFolder) {
    gulp.src('./examples/'+exampleFolder+'/app.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(rename('app.css'))
      .pipe(gulp.dest('./dist/'+exampleFolder));
  });

  gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('browserify', function() {
  examples.forEach(function(exampleFolder) {
    gulp.src('./examples/'+exampleFolder+'/app.js')
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
      .pipe(gulp.dest('./dist/'+exampleFolder));
  });
});


gulp.task('lint', function() {
  return gulp.src([
    './examples/**/*.js',
    './packages/**/*.js',
    './test/**/*.js',
  ]).pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('default', ['assets', 'sass', 'browserify']);