import { EditorSession, forEach } from "substance"

import EditorState from '../shared/EditorState'
import DocumentLoader from "../dar/DocumentLoader"
import ManifestLoaderNew from "../dar/ManifestLoaderNew"
import PubMetaLoader from "../entities/PubMetaLoader"
import TextureEditorSession from "../shared/TextureEditorSession"

/** 
 * @module editor/util/EditorSessionsGenerator
 * 
 * @description
 * A service class that provived various method to 
 * create editor (better document archive - DAR) sessions
 */
export default class EditorSessionsGenerator {

  /**
   * Creates a session for the manifest of a document archive DAR 
   * 
   * @param {Object} archive The document archive DAR 
   * @returns {Promise} A promise that will be resolved with the manifest session 
   * or rejected with errors that occured during the session generation process 
   */
  static generateSessionForManifest(archive) {
    return new Promise(function (resolve, reject) {
      let upstreamArchive = archive.getUpstreamArchive(),
        rawManifest = upstreamArchive.resources['manifest.xml'].data

      EditorSessionsGenerator.generateSessionForManifestFromRawManifest(rawManifest)
        .then(function (manifestSession) {
          resolve(manifestSession)
        })
        .catch(function (errors) {
          reject(errors)
        })
    })
  }

  static generateSessionForManifestFromRawManifest(rawManifest) {
    return new Promise(function (resolve, reject) {
      let manifestLoaderNew = new ManifestLoaderNew()

      manifestLoaderNew.load(rawManifest)
        .then(function (manifest) {
          let options = {
            configurator: manifestLoaderNew.getConfigurator()
          }

          resolve(new EditorSession(manifest, options))
        })
        .catch(function (errors) {
          reject(errors)
        })
    })
  }

  /**
   * Creates a session for the publication metadata resource of a DAR 
   * 
   * @param {Object} archive The document archive DAR 
   * @returns {Promise} A promise that will be resolved with the session for the
   * publication metadata resource or rejected with errors that occured during 
   * the session generation process 
   */
  static generateSessionForPubMeta(archive) {
    return new Promise(function (resolve, reject) {
      try {
        resolve(PubMetaLoader.load())
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Creates sessions for the existing document contained within a DAR 
   * 
   * @param {Object} archive The document archive DAR 
   * @returns {Promise} A promise that will be resolved with the sessions for the
   * documents or rejected with errors that occured during the generation process
   * of the sessions 
   */
  static generateSessionsForExistingDocuments(archive) {
    return new Promise(function (resolve, reject) {
      let archiveConfig = archive.getConfig(),
        existingSessions = archive.getEditorSessions(),
        rawDocuments = archive.getRawDocuments()

      if (!rawDocuments) {
        rawDocuments = {}
      }

      let documentLoader = new DocumentLoader()

      documentLoader.load(rawDocuments, {
        archive: archive,
        pubMetaDb: existingSessions["pub-meta"].getDocument()
      }, archiveConfig)
      .then(function (loadingResults) {
        let sessions = {}

        forEach(loadingResults, function (loadingResult, documentId) {
          sessions[documentId] = EditorSessionsGenerator._createSession(loadingResult, archiveConfig, existingSessions)
        })

        resolve(sessions)
      })
      .catch(function (errors) {
        reject(errors)
      })
    })
  }

  /**
   * Creates a session for a document that has been newly added to a DAR 
   * 
   * @param {Object} archive The document archive DAR 
   * @param {Object} rawDocument The document added newly to the DAR 
   * @returns {Promise} A promise that will be resolved with the sessions for the
   * new document or rejected with errors that occured during the session generation process
   */
  static generateSessionForNewDocument(archive, rawDocument) {
    return new Promise(function (resolve, reject) {
      let archiveConfig = archive.getConfig(),
        existingSessions = archive.getEditorSessions()

      let documentLoader = new DocumentLoader()

      documentLoader.load(rawDocument, {
        archive: archive,
        pubMetaDb: existingSessions["pub-meta"].getDocument()
      }, archiveConfig)
      .then(function (document) {
        resolve(EditorSessionsGenerator._createSession(document, archiveConfig, existingSessions))
      })
      .catch(function (errors) {
        reject(errors)
      })
    })
  }

  /**
   * A helper function that creates the actual document session
   * 
   * @param {Object} loadingResult The document for which to create a session 
   * @returns {Object} The document session
   */
  static _createSession(loadingResult) {

    /*
    let configurator = new TextureConfigurator()
    configurator.import(archiveConfig.ArticleConfig)
        
    let options = {
        configurator: configurator,
        context: existingSessions
    }*/

    let state = new EditorState(loadingResult.document)
    return new TextureEditorSession(state, loadingResult.configurator)
  }
}