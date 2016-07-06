'use strict';
/* eslint-disable no-console, no-invalid-this */

var gulp = require('gulp');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var through2 = require('through2');
var eslint = require('gulp-eslint');
var tape = require('gulp-tape');
var tapSpec = require('tap-spec');
var bundleStyles = require('substance/util/bundleStyles');
var examples = require('./examples/config').examples;
var fs = require('fs');
var path = require('path');
var gulpFile = require('gulp-file');

gulp.task('assets', function () {
  examples.forEach(function(exampleFolder) {
    gulp.src('./examples/'+exampleFolder+'/index.html')
          .pipe(gulp.dest('dist/'+exampleFolder));
  });
  gulp.src('examples/data/*')
    .pipe(gulp.dest('./dist/data'));
  gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('sass', function(done) {
  Promise.all(examples.map(function(exampleFolder) {
    return bundleStyles({
      rootDir: __dirname,
      configuratorPath: require.resolve('./packages/common/BaseConfigurator'),
      configPath: require.resolve('./examples/'+exampleFolder+'/package')
    }).then(function(css) {
      var distPath = path.join(__dirname, 'dist', exampleFolder);
      gulpFile('app.css', css, { src: true })
        .pipe(gulp.dest(distPath));
    }).catch(function(err) {
      console.error(err);
    });
  })).then(function() {
    done();
  });
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

gulp.task('test:server', ['lint'], function() {
  return gulp.src([
    'test/jats/*.test.js'
  ])
  .pipe(tape({
    reporter: tapSpec()
  }));
});

gulp.task('test', ['test:server']);

gulp.task('default', ['assets', 'sass', 'browserify']);
