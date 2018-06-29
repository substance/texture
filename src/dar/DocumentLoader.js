import { forEach } from "substance"

import TextureConfigurator from "../editor/util/TextureConfigurator"
import JATSImporter from "../article/converter/JATSImporter"
import TextureArticlePackage from "../article/TextureArticlePackage"

/**
 * @module dar/DocumentLoader
 * 
 * @description
 * A new document loader which loads all raw documents of a DAR and converts 
 * them to TextureArticle instances
 */
export default class DocumentLoader {

  /**
   * @description
   * Loads all raw document of a DAR and converts them to instances of the TextureArchive class
   * 
   * @param {Object} rawDocuments The raw documents of a DAR
   * @returns {Promise} A promise that will be resolved with the documents of a DAR as instances of the TextureArchive class or 
   * rejected with errors that occured during the loading process 
   */
  load(rawDocuments) {
    if (!rawDocuments) {
      rawDocuments = {}
    }

    if (typeof rawDocuments === "object" && rawDocuments.length === 1) {
      let tmp = {}
      tmp[rawDocuments.id] = rawDocuments
      rawDocuments = tmp
    }

    let singleDocumentLoads = [],
        self = this

    forEach(rawDocuments, function(rawDocument, rawDocumentId) {
      singleDocumentLoads.push( self.loadSingleDocument(rawDocumentId, rawDocument) ) 
    })
    
    return new Promise(function(resolve, reject) {
      Promise.all(singleDocumentLoads)
        .then(function(results) {
          let documents = {}
          
          forEach(results, function(value, key) {
            documents[value.id] = value.document
          })

          resolve(documents)
        })
        .catch(function(errors) {
          reject(errors)
        })
      })
  }

  /**
   * Loads a single raw document of a DAR and converts it to an instance of the TextureArchive class
   * 
   * @param {string} rawDocumentId The id of the raw document of a DAR
   * @param {Object} rawDocuments The raw document of a DAR
   * @returns {Promise} A promise that will be resolved with the document of a DAR as instance of the TextureArchive class or 
   * rejected with errors that occured during the loading process 
   */
  loadSingleDocument(rawDocumentId, rawDocument) {
    return new Promise(function(resolve, reject) {
      if (!rawDocument || !rawDocument.data) {
        reject("rawDocument to load is missing")
      }

      try 
      {
        // TODO this could be done dynamically based upon the type of rawDocument
        let documentImporter = new JATSImporter(), 
            documentImporterResult = documentImporter.import(rawDocument.data)

        if (documentImporterResult.hasErrored) {
          reject(documentImporterResult.errors)
        }

        let configurator = new TextureConfigurator()
        configurator.import(TextureArticlePackage)

        let textureArticleImporter = configurator.createImporter("texture-article"),
            textureArticleImporterResult = textureArticleImporter.importDocument(documentImporterResult.dom)
        
        textureArticleImporterResult.type = rawDocument.type
        
        resolve({
          id: rawDocumentId,
          document: textureArticleImporterResult
        })
      }
      catch(errors) {
        reject(errors)
      }
    })
  }
}