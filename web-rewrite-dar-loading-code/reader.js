import {
    getQueryStringParam,
    substanceGlobals,
    platform
} from 'substance'
import {
    TextureWebApp,
    TextureReader,
    ReaderPackage
} from 'substance-texture'

window.addEventListener('load', () => {
    substanceGlobals.DEBUG_RENDERING = platform.devtools

    let app = TextureReaderApp.mount({
        archiveId: getQueryStringParam('archive') || 'kitchen-sink',
        storageType: getQueryStringParam('storage') || 'vfs',
        storageUrl: getQueryStringParam('storageUrl') || '/archives'
    }, window.document.body)

    // put the archive and some more things into global scope, for debugging
    setTimeout(() => {
        window.app = app
    }, 500)
})

export default class TextureReaderApp extends TextureWebApp {
    _getAppClass() {
        return TextureReader
    }

    _getArticleConfig() {
        return ReaderPackage
    }
}