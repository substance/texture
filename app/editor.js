const { Texture } = window.texture
let remote = require('electron').remote
let args = remote.getGlobal('sharedObject').args

let file = 'data/introducing-texture.xml' // without leading '/'

if(args.length > 2) {
  file = 'data/' + args[2]
}

window.onload = function() {
  window.app = Texture.mount({
  }, document.body)
}
