import DocumentArchiveReadOnly from "./DocumentArchiveReadOnly"
import DocumentArchiveReadWrite from "./DocumentArchiveReadWrite"
import DocumentArchiveTypes from "./DocumentArchiveTypes"

export default class DocumentArchiveFactory {
    static getDocumentArchive(documentArchiveConfig) {
        let documentArchive

        switch( documentArchiveConfig.getId() ) {
            
            case DocumentArchiveTypes.READ_ONLY:
                documentArchive = new DocumentArchiveReadOnly(documentArchiveConfig)
                break;
            
            case DocumentArchiveTypes.READ_WRITE:
                documentArchive = new DocumentArchiveReadWrite(documentArchiveConfig)
                break;
            
            default:
                documentArchive = null
        }

        return documentArchive
    }
}