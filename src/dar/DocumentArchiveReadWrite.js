import DocumentArchiveReadOnly from "./DocumentArchiveReadOnly";
import StorageTypes from "./StorageTypes"
import TextureArchive from "../TextureArchive"
import vfsSaveHook from "../util/vfsSaveHook"


export default class DocumentArchiveReadWrite extends DocumentArchiveReadOnly {
    constructor(documentArchiveConfig) {
        super(documentArchiveConfig)
        this._buffer = documentArchiveConfig.getBuffer()
        
        if (this._storageConfig.getId() == StorageTypes.VFS ) {
            vfsSaveHook(this._storage, TextureArchive)
        }
    }
}