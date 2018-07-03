import { EditorSession, forEach } from "substance"

import DocumentLoader from "../../dar/DocumentLoader"
import ManifestLoaderNew from "../../dar/ManifestLoaderNew"
import PubMetaLoader from "../../PubMetaLoader"
import TextureConfigurator from "./TextureConfigurator"

/**
 * Maybe this could be moved to substance/ui
 */
export default class EditorSessionsGenerator {

    static generateManifestSession(archive) {
        return new Promise(function(resolve, reject) {
            let manifestLoaderNew = new ManifestLoaderNew(),
                upstreamArchive = archive.getUpstreamArchive(),
                rawSession = upstreamArchive.resources['manifest.xml']
            
            manifestLoaderNew.load(rawSession)
                .then(function(manifest) {
                    let options = {
                        configurator: manifestLoaderNew.getConfigurator()
                    }

                    resolve(new EditorSession(manifest, options))
                })
                .catch(function(errors) {
                    reject(errors)
                })
        })
    }

    static generatePubMetaSession(archive) {
        return new Promise(function(resolve, reject) {
            try 
            {
                resolve( PubMetaLoader.load() )
            } 
            catch(error) 
            {
                reject(error)
            }
        })
    }

    static generateDocumentsSession(archive) {
        return new Promise(function(resolve, reject) {
            let archiveConfig = archive.getConfig(),
                editorSessions = archive.getEditorSessions(),
                rawDocuments = archive.getRawDocuments()
                
            if (!rawDocuments) {
                rawDocuments = {}
            }

            let documentLoader = new DocumentLoader()
            
            documentLoader.load(rawDocuments, {
                archive: archive,
                pubMetaDb: editorSessions["pub-meta"].getDocument()
            }, archiveConfig)
                .then(function(documents) {
                    let sessions = {}
                    
                    forEach(documents, function(document, documentId) {
                        let configurator = new TextureConfigurator()
                        configurator.import(archiveConfig.ArticleConfig)
        
                        let options = {
                            configurator: configurator,
                            context: editorSessions
                        }
        
                        sessions[documentId] = new EditorSession(document, options)
                    })

                    resolve(sessions)
                })
                .catch(function(errors) {
                    reject(errors)
                })
        })
    }
}