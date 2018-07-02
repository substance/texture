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

        let finalMountConfig = TextureReaderAppWeb._getFinalMountConfig(customMountPoint)
        let finalMountPoint = TextureReaderAppWeb._getFinalMountPoint(customMountConfig)
        
        console.log("TextureReaderApp.mount() with the following final mount config")
        console.log(finalMountConfig)

        return TextureReaderAppWeb.mount(finalMountConfig, finalMountPoint)
    }

    static _getFinalMountConfig(userProvidedMountConfig) {
        let defaultMountConfig = TextureReaderAppWeb._getDefaultMountConfig() 
        return Object.assign(defaultMountConfig, userProvidedMountConfig)
    }

    static _getFinalMountPoint(userProvidedMountPoint) {
        return userProvidedMountPoint || window.document.body
    }

    static _getDefaultMountConfig() {
        let defaultStorageConfig = new VfsStorageConfig()
        defaultStorageConfig.setDataFolder("./data")

        let storageClient = StorageClientFactory.getStorageClient(defaultStorageClient)

        let documentArchiveDefaultConfig = new DocumentArchiveReadOnlyConfig()
        documentArchiveDefaultConfig.setStorageClient(storageClient)

        return {
            appClass: TextureReader,
            archiveId: getQueryStringParam('archive') || 'kitchen-sink',
            articleConfig: ReaderPackage,
            documentArchiveConfig: documentArchiveDefaultConfig
        }
    }
}