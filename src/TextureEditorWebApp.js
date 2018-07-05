import { getQueryStringParam, substanceGlobals, parseKeyEvent, platform } from 'substance'

import EditorPackage from './editor/EditorPackage'
import HttpStorageClientConfig from './dar/HttpStorageClientConfig'
import InMemoryDarBuffer from './dar/InMemoryDarBuffer';
import StorageClientFactory from './dar/StorageClientFactory'
import Texture from './Texture'
import TextureAppMixin from './TextureAppMixin'
import TextureArchiveConfig from './TextureArchiveConfig'
import VfsStorageClientConfig from './dar/VfsStorageClientConfig'
import WebAppChrome from './WebAppChrome'

export default class TextureEditorWebApp extends TextureAppMixin(WebAppChrome) {
    
    // TODO: document why we need a different keydown behavior here
    // otherwise, if it should be the same, move the common implementation
    // into TextureAppMixin
    _handleKeyDown(event) {
        // Handle custom keyboard shortcuts globally
        let archive = this.state.archive
        let handled = false
        if (archive) {
            let manuscriptSession = archive.getEditorSession('manuscript')
            handled = manuscriptSession.keyboardManager.onKeydown(event)
        }
        if (!handled) {
            let key = parseKeyEvent(event)
            // CommandOrControl+S
            if (key === 'META+83' || key === 'CTRL+83') {
                this._save()
                event.preventDefault()
            }
        }
    }

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
        let defaultMountConfig = TextureEditorWebApp._getDefaultMountConfig(),
            archiveIdQueryParam = getQueryStringParam('archive')

        if (archiveIdQueryParam) {
            customMountConfig.archiveId = archiveIdQueryParam
        }
        
        return Object.assign(defaultMountConfig, customMountConfig)
    }

    static _getFinalMountPoint(customMountPoint) {
        return customMountPoint || window.document.body
    }

    static _getDefaultMountConfig() {
        let storageClientConfig = new VfsStorageClientConfig()
        storageClientConfig.setDataFolder("./data/")

        let storageClientConfigHttp = new HttpStorageClientConfig()
        storageClientConfigHttp.setStorageUrl("http://localhost:4100")

        let storageClient = StorageClientFactory.getStorageClient(storageClientConfigHttp)

        let documentArchiveConfig = new TextureArchiveConfig()
        documentArchiveConfig.setArticleConfig(EditorPackage)
        documentArchiveConfig.setBuffer( new InMemoryDarBuffer() )
        documentArchiveConfig.setStorageConfig(storageClientConfig)
        documentArchiveConfig.setStorageClient(storageClient)
        

        return {
            appClass: Texture,
            archiveId: 'kitchen-sink',
            documentArchiveConfig: documentArchiveConfig
        }
    }
}