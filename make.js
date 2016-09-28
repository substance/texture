var b = require('substance-bundler');

b.task('clean', function() {
  b.rm('./dist')
})

// copy assets
b.task('assets', function() {
  b.copy('examples/index.html', './dist/')
  b.copy('texture.css', './dist/')
  b.copy('packages/**/*.css', './dist/')
  b.copy('examples/data', './dist/data')
  b.copy('node_modules/font-awesome', './dist/font-awesome')
})

// this optional task makes it easier to work on Substance core
b.task('substance', function() {
  b.make('substance', 'clean', 'css', 'browser')
  b.copy('node_modules/substance/dist', './dist/substance')
})

b.task('substance:all', function() {
  b.make('substance')
})

function buildExample(example) {
  return function() {
    b.copy('examples/'+example+'/index.html', './dist/'+example+'/')
    b.copy('examples/'+example+'/*.css', './dist/'+example+'/', { root: 'examples/'+example })
    b.js('examples/'+example+'/app.js', {
      // need buble if we want to minify later
      // buble: true,
      external: ['substance'],
      commonjs: { include: ['node_modules/lodash/**'] },
      dest: './dist/'+example+'/app.js',
      format: 'umd',
      moduleName: example
    })
  }
}

b.task('author', ['clean', 'substance', 'assets'], buildExample('author'))
b.task('publisher', ['clean', 'substance', 'assets'], buildExample('publisher'))
b.task('tagging', ['author'], buildExample('tagging'))
b.task('examples', ['author', 'publisher', 'tagging'])

// build all
b.task('default', ['examples'])


b.task('test:clean', function() {
  b.rm('dist/test')
})

b.task('test:assets', function() {
  b.copy('./node_modules/substance-test/dist/*', './dist/test', { root: './node_modules/substance-test/dist' })
})

b.task('test:browser', function() {
  b.js('./test/index.js', {
    // buble necessary here, as travis has old browser versions
    buble: true,
    ignore: ['substance-cheerio'],
    external: ['substance-test', 'substance'],
    commonjs: { include: ['node_modules/lodash/**'] },
    targets: [
      { dest: './dist/test/tests.js', format: 'umd', moduleName: 'tests' }
    ]
  });
})

b.task('test:server', function() {
  b.js('./test/index.js', {
    // buble necessary here, for nodejs
    buble: true,
    external: ['substance-test', 'substance'],
    commonjs: {
      include: [
        'node_modules/lodash/**',
        'node_modules/substance-cheerio/**'
      ]
    },
    targets: [
      { dest: './dist/test/run-tests.js', format: 'cjs' },
    ]
  });
})

b.task('test', ['substance:all', 'test:clean', 'test:assets', 'test:browser', 'test:server'])


// starts a server when CLI argument '-s' is set
b.setServerPort(5555)
b.serve({
  static: true, route: '/', folder: 'dist'
})
