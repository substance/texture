const { Texture } = window.texture

// Loading XML: In this example we use a bundled virtual file-system
const DEFAULT_FILE = 'data/introducing-texture.xml' // without leading '/'

let htmlParams = new URLSearchParams(location.search.slice(1))
let file = htmlParams.get('file') || DEFAULT_FILE

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
