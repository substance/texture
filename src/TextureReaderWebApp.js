import { getQueryStringParam, substanceGlobals, platform } from 'substance'
import { TextureReader, ReaderPackage } from './reader'

import DocumentArchiveReadOnly from './dar/DocumentArchiveReadOnly'
import TextureAppMixin from './TextureAppMixin'
import VfsStorageConfig from './dar/VfsStorageConfig'
import WebAppChrome from './WebAppChrome'

export default class TextureReaderAppWeb extends TextureAppMixin(WebAppChrome) {
    
    static start(customMountConfig, customMountPoint) {
        substanceGlobals.DEBUG_RENDERING = platform.devtools

        let finalMountConfig = TextureReaderAppWeb._getFinalMountPointConfig(customMountPoint)
        let finalMountPoint = TextureReaderAppWeb._getFinalMountPoint(customMountConfig)
        
        console.log("TextureReaderApp.mount() with the following final mount config")
        console.log(finalMountConfig)

        return TextureReaderAppWeb.mount(finalMountConfig, finalMountPoint)
    }

    static _getFinalMountConfig(userProvidedMountConfig) {
        let defaultMountConfig = TextureReaderAppWeb._getDefaultStorageConfig() 
        return Object.assign(defaultMountConfig, userProvidedMountConfig)
    }

    static _getFinalMountPoint(userProvidedMountPoint) {
        return userProvidedMountPoint || window.document.body
    }

    static _getDefaultStorageConfig() {
        return {
            appClass: TextureReader,
            archiveClass: DocumentArchiveReadOnly,
            archiveId: getQueryStringParam('archive') || 'kitchen-sink',
            articleConfig: ReaderPackage,
            storageConfig: TextureReaderAppWeb._getDefaultStorageConfig()
        }
    }

    static _getDefaultStorageConfig() {
        let defaultStorageConfig = new VfsStorageConfig()
        defaultStorageConfig.setDataFolder("./data")
        return defaultStorageConfig
    }
}