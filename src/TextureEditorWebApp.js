import { getQueryStringParam, substanceGlobals, platform } from 'substance'

import EditorPackage from './editor/EditorPackage'
import { TextureReader } from './reader'

import DocumentArchiveReadWriteConfig from './dar/DocumentArchiveReadWriteConfig'
import StorageClientFactory from './dar/StorageClientFactory'
import TextureAppMixin from './TextureAppMixin'
import VfsStorageConfig from './dar/VfsStorageConfig'
import WebAppChrome from './WebAppChrome'
import InMemoryDarBuffer from './dar/InMemoryDarBuffer';

export default class TextureEditorWebApp extends TextureAppMixin(WebAppChrome) {
    
    static start(customMountConfig, customMountPoint) {
        substanceGlobals.DEBUG_RENDERING = platform.devtools

        let finalMountConfig = TextureEditorWebApp._getFinalMountConfig(customMountConfig)
        let finalMountPoint = TextureEditorWebApp._getFinalMountPoint(customMountPoint)
        
        console.group("TextureEditorApp.mount()")
            console.group("mount config")
                console.log(finalMountConfig)
            console.groupEnd()
        console.groupEnd()

        return TextureEditorWebApp.mount(finalMountConfig, finalMountPoint)
    }

    static _getFinalMountConfig(customMountConfig) {
        let defaultMountConfig = TextureEditorWebApp._getDefaultMountConfig() 
        return Object.assign(defaultMountConfig, customMountConfig)
    }

    static _getFinalMountPoint(customMountPoint) {
        return customMountPoint || window.document.body
    }

    static _getDefaultMountConfig() {
        let storageConfig = new VfsStorageConfig()
        storageConfig.setDataFolder("./data/")

        let storageClient = StorageClientFactory.getStorageClient(storageConfig)

        let documentArchiveConfig = new DocumentArchiveReadWriteConfig()
        documentArchiveConfig.setArticleConfig(EditorPackage)
        documentArchiveConfig.setBuffer( new InMemoryDarBuffer() )
        documentArchiveConfig.setStorageConfig(storageConfig)
        documentArchiveConfig.setStorageClient(storageClient)
        

        return {
            appClass: TextureReader,
            archiveId: getQueryStringParam('archive') || 'kitchen-sink',
            documentArchiveConfig: documentArchiveConfig
        }
    }
}