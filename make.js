var b = require('substance-bundler');

b.task('clean', function() {
  b.rm('./dist')
})

// this optional task makes it easier to work on Substance core
b.task('substance', function() {
  b.make('substance')
})

// copy assets
b.task('assets', function() {
  b.copy('examples/data', './dist/')
  b.copy('node_modules/font-awesome/fonts', './dist/')
})

var examples = ['author', 'publisher']
// options for js bundling
examples.forEach(function(example) {
  b.task(example, function() {
    b.copy('examples/'+example+'/index.html', './dist/'+example+'/')
    b.js('examples/'+example+'/app.js', {
      dest: './dist/'+example+'/app.js',
      format: 'umd',
      moduleName: example
    })
  })
})

b.task('examples', examples)

b.task('minify_examples', function() {
  examples.forEach(function(folder) {
    b.minify('./dist/'+folder+'/app.js')
  })
})

b.task('default', ['clean', 'assets', 'examples', 'minify_examples'])
