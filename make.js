const b = require('substance-bundler')
const fs = require('fs')
const path = require('path')
// used to bundle example files for demo
const vfs = require('substance-bundler/extensions/vfs')

const DIST = 'dist/'
const TMP = 'tmp/'

b.task('clean', function() {
  b.rm(DIST)
  b.rm(TMP)
})

b.task('assets', function() {
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

b.task('demo', ['clean', 'build:dev'], () => {
  vfs(b, {
    src: ['./data/**/*'],
    dest: 'tmp/vfs.js',
    format: 'umd', moduleName: 'vfs'
  })
})

/* TESTS */

b.task('build:test:node', ['clean:test'], _buildTestsNode)

b.task('run:test:node', ['build:test:node'], _runTestsNode)

b.task('run:test', ['run:test:node'])

b.task('test:browser', ['clean:test', 'assets:test'], function() {
  _buildTestsBrowser()
})

b.task('test', ['run:test'])


/* HELPERS */

function _buildLib(DEST, transpileToES5) {
  b.js('./index.es.js', {
    target: {
      dest: DEST+'texture.js',
      format: 'umd', moduleName: 'texture', sourceMapRoot: __dirname, sourceMapPrefix: 'texture',
      // useStrict: !transpileToES5
    },
    external: [ 'substance', 'texture-jats'],
    globals: {
      'substance': 'substance',
      'texture-jats': 'TextureJATS'
    }
  })
}

function _buildCSS(DEST, transpileToES5) {
  b.css('texture.css', DEST+'texture.css', {variables: transpileToES5})
  b.css('./node_modules/substance/substance-pagestyle.css', DEST+'texture-pagestyle.css', {variables: transpileToES5})
  b.css('./node_modules/substance/substance-reset.css', DEST+'texture-reset.css', {variables: transpileToES5})
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
