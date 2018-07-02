import DocumentArchiveReadOnly from "./DocumentArchiveReadOnly";

export default class DocumentArchiveReadWrite extends DocumentArchiveReadOnly {
    constructor(documentArchiveConfig) {
        super(documentArchiveConfig)
        this.buffer = documentArchiveConfig.getBuffer()
    }
}