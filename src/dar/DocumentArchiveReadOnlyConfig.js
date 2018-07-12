import DocumentArchiveTypes from "./DocumentArchiveTypes"
import DocumentArchiveConfig from "./DocumentArchiveConfig";

/** 
 * @module dar/DocumentArchiveReadOnlyConfig
 * 
 * @description
 * This module holds all configuration parameters for a
 * read-only document archive (read-only DAR) instance
 */
export default class DocumentArchiveReadOnlyConfig extends DocumentArchiveConfig {
    constructor() {
        super()
        this.setId(DocumentArchiveTypes.READ_ONLY)
    }
}