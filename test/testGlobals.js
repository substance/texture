import vfs from '../tmp/vfs.es.js'

if (typeof global !== 'undefined') {
  global.vfs = vfs
}
