import { forEach } from "substance"

import ArticleConfigurator from "../article/ArticleConfigurator"
import ArticleModelPackage from "../article/ArticleModelPackage"
import JATSImporter from "../article/converter/JATSImporter"

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
   * @param {Object} context
   * @param {Object} config
   * @returns {Promise} A promise that will be resolved with the documents of a DAR as instances of the TextureArchive class or 
   * rejected with errors that occured during the loading process 
   */
  load(rawDocuments, context, config) {
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
      if (!rawDocument || !rawDocument.type === "pub-meta") {
        return false
      }

      singleDocumentLoads.push( self.loadSingleDocument(rawDocumentId, rawDocument, context, config) ) 
    })
    
    return new Promise(function(resolve, reject) {
      Promise.all(singleDocumentLoads)
        .then(function(results) {
          let loadingResults = {}

          forEach(results, function(value, key) {
            loadingResults[value.id] = {
              configurator: value.configurator,
              document: value.document
            }
          })

          resolve(loadingResults)
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
   * @param {Object} context
   * @param {Object} config
   * @returns {Promise} A promise that will be resolved with the document of a DAR as instance of the TextureArchive class or 
   * rejected with errors that occured during the loading process 
   */
  loadSingleDocument(rawDocumentId, rawDocument, context, config) {
    return new Promise(function(resolve, reject) {
      if (!rawDocument || !rawDocument.data) {
        reject("rawDocument to load is missing")
      }

      try 
      {
        // TODO this could be done dynamically based upon the type of rawDocument
        let documentImporter = new JATSImporter(), 
            documentImporterResult = documentImporter.import(rawDocument.data, context)

        if (documentImporterResult.hasErrored) {
          let error = new Error()
          error.type = 'jats-import-error'
          error.detail = documentImporterResult.errors
          reject(error)
        }

        let configurator = new ArticleConfigurator()
        configurator.import(ArticleModelPackage)

        let textureArticleImporter = configurator.createImporter("texture-article"),
            textureArticleImporterResult = textureArticleImporter.importDocument(documentImporterResult.dom)
        
        textureArticleImporterResult.type = rawDocument.type
        
        resolve({
          id: rawDocumentId,
          configurator: configurator,
          document: textureArticleImporterResult
        })
      }
      catch(errors) {
        reject(errors)
      }
    })
  }
}