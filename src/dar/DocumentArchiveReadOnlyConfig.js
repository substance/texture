import DocumentArchiveTypes from "./DocumentArchiveTypes"
import DocumentArchiveConfig from "./DocumentArchiveConfig";

export default class DocumentArchiveReadOnlyConfig extends DocumentArchiveConfig {
    constructor() {
        super()
        this.setId(DocumentArchiveTypes.READ_ONLY)
    }
}