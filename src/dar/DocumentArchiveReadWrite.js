import DocumentArchiveReadOnly from "./DocumentArchiveReadOnly";

export default class DocumentArchiveReadWrite extends DocumentArchiveReadOnly {
    constructor(documentArchiveConfig) {
        super(documentArchiveConfig)
        
        this._archiveId = null
        this._buffer = documentArchiveConfig.getBuffer()
        this._config = documentArchiveConfig.getArticleConfig()
        this._pendingFiles = {}
        this._sessions = null
        this._upstreamArchive = null
    }
}