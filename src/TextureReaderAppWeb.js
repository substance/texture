import { getQueryStringParam, substanceGlobals, platform } from 'substance'
import { TextureReader, ReaderPackage } from './reader'

import TextureArchive from './TextureArchive'
import TextureAppMixin from './TextureAppMixin'
import VfsStorageConfig from './dar/VfsStorageConfig'
import WebAppChrome from './WebAppChrome'

export default class TextureReaderAppWeb extends TextureAppMixin(WebAppChrome) {
    
    static start(mountConfig, mountPoint) {
        substanceGlobals.DEBUG_RENDERING = platform.devtools

        let defaultMountConfig = {
            appClass: TextureReader,
            archiveClass: TextureArchive,
            archiveId: getQueryStringParam('archive') || 'kitchen-sink',
            articleConfig: ReaderPackage,
            storageConfig: new VfsStorageConfig()
        }

        let finalMountPoint = mountPoint || window.document.body
        let finalMountConfig = Object.assign(defaultMountConfig, mountConfig)
        
        console.log(finalMountConfig)
        console.log("TextureReaderApp.mount()")

        return TextureReaderAppWeb.mount(finalMountConfig, finalMountPoint)
    }
}