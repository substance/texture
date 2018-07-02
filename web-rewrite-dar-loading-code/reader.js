import { TextureReaderWebApp } from "substance-texture"

window.addEventListener('load', () => {
    let app = TextureReaderWebApp.start()
    
    // put the archive and some more things into global scope, for debugging
    setTimeout(() => {
        window.app = app
    }, 500)
})