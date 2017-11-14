const { Texture } = window.texture
let remote = require('electron').remote
let args = remote.getGlobal('sharedObject').args

// Loading XML: In this example we use a bundled virtual file-system
let file = 'data/introducing-texture.xml' // without leading '/'

if(args.length > 2) {
  file = 'data/' + args[2]
}

window.onload = function() {
  window.app = Texture.mount({
    documentId: file,
    /*
      Implement your own logic to read and write XML
    */
    readXML: function(documentId, cb) {
      let xmlStr = vfs.readFileSync(documentId)
      cb(null, xmlStr)
    },
    writeXML: function(documentId, xml, cb) {
      console.log('writeXML needs to be implemented for saving.')
      console.log('XML', xml)
      cb(null)
    }
  }, document.body)
}
