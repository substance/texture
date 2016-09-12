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
  b.make('substance', 'clean', 'css', 'browser:umd')
  b.copy('node_modules/substance/dist', './dist/substance')
})

var examples = ['author', 'publisher']
// options for js bundling
examples.forEach(function(example) {
  b.task("example:"+example, function() {
    b.copy('examples/'+example+'/index.html', './dist/'+example+'/')
    b.copy('examples/'+example+'/*.css', './dist/'+example+'/', { root: 'examples/'+example })
    b.js('examples/'+example+'/app.js', {
      // need buble if we want to minify later
      buble: true,
      external: ['substance'],
      commonjs: { include: ['node_modules/lodash/**'] },
      dest: './dist/'+example+'/app.js',
      format: 'umd',
      moduleName: example
    })
  })
})

b.task('examples', examples.map(function(example)  {
  return "example:"+example
}))

b.task('minify:examples', function() {
  examples.forEach(function(folder) {
    b.minify('./dist/'+folder+'/app.js')
  })
})

b.task('minify', ['minify:examples'])

var basics = ['clean', 'assets', 'substance']

// build all
b.task('default', basics.concat(['examples', 'minify']))

// for dev purpose build only author relevant stuff
b.task('author', basics.concat('example:author'))
b.task('publisher', basics.concat('example:publisher'))

// starts a server when CLI argument '-s' is set
b.setServerPort(5555)
b.serve({
  static: true, route: '/', folder: 'dist'
})
