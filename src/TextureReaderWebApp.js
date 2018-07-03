import { getQueryStringParam, substanceGlobals, platform } from 'substance'
import { TextureReader, ReaderPackage } from './reader'

import DocumentArchiveReadOnlyConfig from './dar/DocumentArchiveReadOnlyConfig'
import StorageClientFactory from './dar/StorageClientFactory'
import TextureAppMixin from './TextureAppMixin'
import VfsStorageConfig from './dar/VfsStorageConfig'
import WebAppChrome from './WebAppChrome'

export default class TextureReaderAppWeb extends TextureAppMixin(WebAppChrome) {
    
    static start(customMountConfig, customMountPoint) {
        substanceGlobals.DEBUG_RENDERING = platform.devtools

        let finalMountConfig = TextureReaderAppWeb._getFinalMountConfig(customMountConfig)
        let finalMountPoint = TextureReaderAppWeb._getFinalMountPoint(customMountPoint)
        
        console.group("TextureReaderApp.mount()")
            console.group("mount config")
                console.log(finalMountConfig)
            console.groupEnd()
        console.groupEnd()

        return TextureReaderAppWeb.mount(finalMountConfig, finalMountPoint)
    }

    static _getFinalMountConfig(customMountConfig) {
        let defaultMountConfig = TextureReaderAppWeb._getDefaultMountConfig() 
        return Object.assign(defaultMountConfig, customMountConfig)
    }

    static _getFinalMountPoint(customMountPoint) {
        return customMountPoint || window.document.body
    }

    static _getDefaultMountConfig() {
        let storageConfig = new VfsStorageConfig()
        storageConfig.setDataFolder("./data/")

        let storageClient = StorageClientFactory.getStorageClient(storageConfig)

        let documentArchiveConfig = new DocumentArchiveReadOnlyConfig()
        documentArchiveConfig.setArticleConfig(ReaderPackage)
        documentArchiveConfig.setStorageClient(storageClient)

        return {
            appClass: TextureReader,
            archiveId: getQueryStringParam('archive') || 'kitchen-sink',
            documentArchiveConfig: documentArchiveConfig
        }
    }
}