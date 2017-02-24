/*
  IMPORTANT: Don't use ES6 here, as some people are still on Node 4.
*/

var b = require('substance-bundler')
var fs = require('fs')
var path = require('path')

var DIST = 'dist/'
var NPM = '.npm/'
var NPMDIST = NPM+'dist/'
var TEST = '.test/'
var STUFF = [
  'package.json',
  'LICENSE.md',
  'README.md',
  'CHANGELOG.md',
  'make.js'
]

function _buildLib(DEST, transpileToES5) {
  b.js('./index.es.js', {
    target: {
      dest: DEST+'texture.js',
      format: 'umd', moduleName: 'texture', sourceMapRoot: __dirname, sourceMapPrefix: 'texture',
      useStrict: !transpileToES5
    },
    buble: transpileToES5,
    commonjs: true,
  })
}

function _buildCSS(DEST, transpileToES5) {
  // Bundle CSS
  b.css('texture.css', DEST+'texture.css', {variables: transpileToES5})
  b.css('./node_modules/substance/substance-pagestyle.css', DEST+'texture-pagestyle.css', {variables: transpileToES5})
  b.css('./node_modules/substance/substance-reset.css', DEST+'texture-reset.css', {variables: transpileToES5})
}

function _copyAssets(DEST) {
  b.copy('./node_modules/font-awesome', DEST+'font-awesome')

  // Landing page
  b.copy('./index.html', DEST+'index.html')
  // Examples
  b.copy('./examples', DEST+'examples')

  // Convert XML files to data.js
  b.custom('Bundle XML files as data.js', {
    src: ['data/*.xml'],
    dest: DEST+'examples/data.js',
    execute: function(files) {
      var xmls = {}
      files.forEach(function(f) {
        var xml = fs.readFileSync(f, 'utf8')
        var docId = path.basename(f, '.xml')
        xmls[docId] = xml
      })
      var out = [
        "window.XMLFILES = ",
        JSON.stringify(xmls)
      ].join('')
      fs.writeFileSync(DEST+'examples/data.js', out)
    }
  })
}

function _buildTestsBrowser(transpileToES5) {
  b.js('./test/index.js', {
    target: {
      dest: TEST+'tests.js',
      format: 'umd', moduleName: 'tests'
    },
    commonjs: true,
    buble: transpileToES5,
    external: { 'substance-test': 'substanceTest' },
  })
}

function _buildTestsNode() {
  b.js('./test/index.js', {
    target: {
      dest: TEST+'tests.cjs.js',
      format: 'cjs'
    },
    external: ['substance-test'],
    buble: true,
    commonjs: true
  })
}

function _runTestsNode() {
  b.custom('Running nodejs tests...', {
    execute: function() {
      let cp = require('child_process')
      return new Promise(function(resolve, reject) {
        const child = cp.fork(path.join(__dirname, '.test/run-tests.js'))
        child.on('message', function(msg) {
          if (msg === 'done') { resolve() }
        })
        child.on('error', function(error) {
          reject(new Error(error))
        })
        child.on('close', function(exitCode) {
          if (exitCode !== 0) {
            process.exit(exitCode)
          } else {
            resolve()
          }
        })
      });
    }
  })
}

b.task('clean:dist', function() {
  b.rm(DIST)
})

b.task('clean:test', function() {
  b.rm(TEST)
})

b.task('clean:npm', function() {
  b.rm(NPM)
})

b.task('clean', ['clean:dist', 'clean:test', 'clean:npm'])

b.task('assets', function() {
  _copyAssets(DIST)
})

b.task('substance:css', function() {
  b.make('substance', 'css')
})

b.task('build:browser', ['substance:css'], function() {
  _buildLib(DIST, true)
  _buildCSS(DIST, true)
})

b.task('build:browser:pure', function() {
  _buildLib(DIST, false)
  _buildCSS(DIST, false)
})

b.task('build', ['clean', 'assets', 'build:browser'])

b.task('build:dev', ['clean', 'assets', 'build:browser:pure'])

// default build: creates a dist folder with a production bundle
b.task('default', ['clean', 'assets', 'build'])

b.task('dev', ['clean', 'assets', 'build:dev'])


/* TESTS */

b.task('assets:test', function() {
  b.copy('./node_modules/substance-test/dist/*', TEST, { root: './node_modules/substance-test/dist' })
})

b.task('build:test:node', ['clean:test', 'assets:test'], _buildTestsNode)

b.task('run:test:node', ['build:test:node'], _runTestsNode)

b.task('run:test', ['run:test:node'])

b.task('test:browser', ['clean:test', 'assets:test'], function() {
  _buildTestsBrowser()
})

b.task('test', ['run:test'])

/* NPM */

b.task('assets:npm', function() {
  _copyAssets(NPMDIST)

  // Copy source
  b.copy('index.es.js', NPM)
  b.copy('lib/**/*.js', NPM)
  // Copy stuff
  STUFF.forEach(function(f) {
    b.copy(f, NPM)
  })
})

b.task('build:npm', function() {
  _buildLib(NPMDIST, true, true)
  _buildCSS(NPMDIST, true)
})

b.task('npm', ['clean:npm', 'assets:npm', 'build:npm'])

// Experimental: XSD driven editor
b.task('xsd', ['clean', 'assets'], function() {
  b.custom('Bundle XML files as xsd.js', {
    src: ['data/*.xsd'],
    dest: 'dist/examples/xsd/xsd.js',
    execute: function(files) {
      var xmls = {}
      files.forEach(function(f) {
        var xml = fs.readFileSync(f, 'utf8')
        var docId = path.basename(f, '.xsd')
        xmls[docId] = xml
      })
      var out = [
        "window.XSD = ",
        JSON.stringify(xmls)
      ].join('')
      fs.writeFileSync('dist/examples/xsd/xsd.js', out)
    }
  })
  b.js('./lib/xsd/demo.js', {
    dest: 'dist/examples/xsd/demo.js',
    format: 'umd', moduleName: 'xsd'
  })
})

/* HTTP server */

b.setServerPort(5555)
b.serve({ static: true, route: '/', folder: 'dist' })
b.serve({ static: true, route: '/test/', folder: '.test' })
