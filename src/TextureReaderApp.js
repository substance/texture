import { getQueryStringParam, substanceGlobals, platform } from 'substance'
import TextureWebApp from './TextureWebApp'
import { TextureReader, ReaderPackage } from './reader'

export default class TextureReaderApp extends TextureWebApp {
    
    static start(config, mountPoint) {
        substanceGlobals.DEBUG_RENDERING = platform.devtools

        let defaultMountPoint = window.document.body,
            defaultConfig = {
                archiveId: getQueryStringParam('archive') || 'kitchen-sink',
                storageType: getQueryStringParam('storage') || 'vfs',
                storageUrl: getQueryStringParam('storageUrl') || '/archives'
            }

        let finalConfig = Object.assign(defaultConfig, config),
            finalMountPoint = mountPoint || defaultMountPoint

        return TextureReaderApp.mount(finalConfig, finalMountPoint)
    }

    _getAppClass() {
        return TextureReader
    }

    _getArticleConfig() {
        return ReaderPackage
    }
}