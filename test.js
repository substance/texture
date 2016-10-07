var path = require('path')
var cp = require('child_process')
var b = require('substance-bundler')

b.task('build', function() {
  b.make(require.resolve('./make.js'), 'test')
})

// TODO: tape is exiting the process when done :(
// so this task must be called at last
b.task('server', function() {
  b.custom('Running nodejs tests...', {
    execute: function() {
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
          }
        })
      });
    }
  })
})

b.task('default', ['build', 'server'])
