var b = require('substance-bundler')
var fs = require('fs')
var path = require('path')

var DIST = 'dist/'
var NPM = '.npm/'
var NPMDIST = NPM+'dist/'
var TEST ='.test/'

b.task('test:server', function() {
  // Cleanup
  b.rm(TEST)
  b.make('substance')

  // TODO: it would be nice to treat such glob patterns
  // differently, so that we do not need to specify glob root
  b.copy('./node_modules/substance-test/dist/*', TEST, { root: './node_modules/substance-test/dist' })

  b.js('./test/index.js', {
    // buble necessary here, for nodejs
    buble: true,
    external: ['substance-test', 'substance'],
    commonjs: {
      include: [
        '/**/lodash/**',
        '/**/substance-cheerio/**'
      ]
    },
    targets: [
      { dest: TEST+'tests.cjs.js', format: 'cjs' },
    ]
  })
})

b.task('test:browser', function() {
  b.js('./test/index.js', {
    // buble necessary here, as travis has old browser versions
    buble: true,
    ignore: ['substance-cheerio'],
    external: ['substance-test', 'substance'],
    commonjs: { include: ['node_modules/lodash/**'] },
    targets: [
      { dest: TEST+'tests.js', format: 'umd', moduleName: 'tests' }
    ]
  })
})

b.task('test', ['test:browser', 'test:server'])

/* Development bundle */
b.task('dev', function() {
  b.rm(DIST)
  _buildDist(DIST, true)
})

/* Prepare NPM bundle */
b.task('npm', function() {
  // Cleanup
  b.rm(NPM)
  _buildDist(NPMDIST, true)

  // Copy source
  b.copy('index.es.js', NPM)
  b.copy('lib/**/*.js', NPM)

  // Copy stuff
  ;[
    'package.json',
    'LICENSE.md',
    'README.md',
    'CHANGELOG.md',
    'make.js'
  ].forEach(function(f) {
    b.copy(f, NPM)
  })
})

b.task('default', ['dev'])

function _buildDist(DIST, transpileToES5) {
  // Bundle Substance and Texture JS
  _substanceJS(DIST+'substance', transpileToES5)
  _textureJS(DIST, transpileToES5)
  // Bundle CSS
  b.css('texture.css', DIST+'texture.css', {variables: transpileToES5})
  b.css('./node_modules/substance/dist/substance-pagestyle.css', DIST+'texture-pagestyle.css', {variables: transpileToES5})
  b.css('./node_modules/substance/dist/substance-reset.css', DIST+'texture-reset.css', {variables: transpileToES5})

  // Copy assets
  _distCopyAssets(DIST)
}

function _substanceJS(DEST, transpileToES5) {
  if (transpileToES5) {
    b.make('substance', 'clean', 'browser')
  } else {
    b.make('substance', 'clean', 'browser:pure')
  }
  b.copy('node_modules/substance/dist', DEST)
}


function _textureJS(DEST, transpileToES5) {
  b.js('./index.es.js', {
    buble: transpileToES5,
    external: ['substance'],
    commonjs: { include: ['node_modules/lodash/**'] },
    targets: [{
      useStrict: !transpileToES5,
      dest: DEST+'texture.js',
      format: 'umd', moduleName: 'texture', sourceMapRoot: __dirname, sourceMapPrefix: 'texture'
    }]
  })
}

function _distCopyAssets(DIST) {
  "use strict";
  b.copy('./node_modules/font-awesome', DIST+'font-awesome')

  // Landing page
  b.copy('./index.html', DIST+'index.html')
  // Examples
  b.copy('./examples', DIST+'examples')

  // Convert XML files to data.js
  b.custom('Bundle XML files as data.js', {
    src: ['data/*.xml'],
    dest: DIST+'examples/data.js',
    execute: function(files) {
      let xmls = {}
      files.forEach(function(f) {
        let xml = fs.readFileSync(f, 'utf8')
        let docId = path.basename(f, '.xml')
        xmls[docId] = xml
      })
      let out = [
        "window.XMLFILES = ",
        JSON.stringify(xmls)
      ].join('')
      fs.writeFileSync(DIST+'examples/data.js', out)
    }
  })
}

// starts a server when CLI argument '-s' is set
b.setServerPort(5555)
b.serve({
  static: true, route: '/', folder: 'dist'
})
