import DocumentArchiveReadOnly from "./DocumentArchiveReadOnly"
import DocumentArchiveReadWrite from "./DocumentArchiveReadWrite"
import DocumentArchiveTypes from "./DocumentArchiveTypes"
import InMemoryDarBuffer  from "./InMemoryDarBuffer"
import TextureArchive from "../TextureArchive"

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
                let storage = documentArchiveConfig.getStorageClient(),
                    buffer = new InMemoryDarBuffer(),
                    context = documentArchiveConfig.getContext(),
                    config = {
                        ArticleConfig: documentArchiveConfig.getArticleConfig()
                    }

                documentArchive = new TextureArchive(storage, buffer, context, config);
        }

        return documentArchive
    }
}