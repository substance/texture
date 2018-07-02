import DocumentArchiveReadOnly from "./DocumentArchiveReadOnly"
import DocumentArchiveTypes from "./DocumentArchiveTypes"

export default class DocumentArchiveFactory {
    static getDocumentArchive(documentArchiveConfig) {
        let documentArchive

        switch( documentArchiveConfig.getId() ) {
            case DocumentArchiveTypes.READ_ONLY:
                storageClient = new DocumentArchiveReadOnly(documentArchiveConfig)
                break;
            default:
        }

        return documentArchive
    }
}