import DocumentArchiveTypes from "./DocumentArchiveTypes"
import DocumentArchiveConfig from "./DocumentArchiveConfig";

export default class DocumentArchiveReadWriteConfig extends DocumentArchiveConfig {
    constructor() {
        super(DocumentArchiveTypes.READ_WRITE)
        this.buffer = null
    }

    getBuffer() {
        return this.buffer
    }

    setBuffer(buffer) {
        this.buffer = buffer
    }
}