// Note: so that Nodejs tests can access the example data via VFS
// we need to require the bundled file which registers itself as `global.vfs`
if (typeof global !== 'undefined') {
  require('../../dist/vfs.js')
  require('../../dist/test/test-vfs.js')
  // suppress warnings and errors (only in nodejs to have more concise reports)
  console.info = () => {}
  console.error = () => {}
  console.warn = () => {}
}
