import { TextureReaderApp } from "substance-texture"

window.addEventListener('load', () => {
    let app = TextureReaderApp.start()
    
    // put the archive and some more things into global scope, for debugging
    setTimeout(() => {
        window.app = app
    }, 500)
})