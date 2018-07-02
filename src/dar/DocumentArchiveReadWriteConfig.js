import DocumentArchiveTypes from "./DocumentArchiveTypes"
import DocumentArchiveReadOnlyConfig from "./DocumentArchiveReadOnlyConfig";

export default class DocumentArchiveReadWriteConfig extends DocumentArchiveReadOnlyConfig {
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