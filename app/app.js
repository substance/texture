import { TextureEditorDesktopApp } from 'substance-texture'

window.addEventListener("load", function() {
  let app = TextureEditorDesktopApp.start()

  // put the archive and some more things into global scope, for debugging
  setTimeout(() => {
    window.app = app
  }, 500)
})