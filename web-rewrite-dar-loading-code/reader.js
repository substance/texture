import { TextureReaderAppWeb } from "substance-texture"

window.addEventListener('load', () => {
    let app = TextureReaderAppWeb.start()
    
    // put the archive and some more things into global scope, for debugging
    setTimeout(() => {
        window.app = app
    }, 500)
})