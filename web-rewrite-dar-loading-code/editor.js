import { TextureEditorWebApp } from 'substance-texture'

window.addEventListener('load', () => {
  let app = TextureEditorWebApp.start({
      archiveId: "elife-32671"
  })
  
  // put the archive and some more things into global scope, for debugging
  setTimeout(() => {
      window.app = app
  }, 500)
})
