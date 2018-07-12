import { platform } from 'substance'

import EditorSessionsGenerator from "../sessions/EditorSessionsGenerator"
import EditorSessionsValidator from "../sessions/EditorSessionsValidator"

// monkey patch VfsStorageClient so that we can check if the stored data
// can be loaded
export default function vfsSaveHook(storage, ArchiveClass, documentArchiveConfig) {
  
  storage.write = function(archiveId, rawArchiveToSave) {
    return new Promise(function (resolve, reject) {
      
      console.group("Writing archive version: " + rawArchiveToSave.version)
        console.log(rawArchiveToSave) // eslint-disable-line
      console.groupEnd()

      let rawArchiveSaved, archiveSaved

      storage.read(archiveId)
        .then(function(rawArchiveOriginal) {
          rawArchiveSaved = rawArchiveOriginal
          rawArchiveSaved.resources = Object.assign(rawArchiveOriginal.resources, rawArchiveSaved.resources)
          rawArchiveSaved.version = rawArchiveToSave.version
          
          archiveSaved = new ArchiveClass(documentArchiveConfig)
          archiveSaved.setUpstreamArchive(rawArchiveSaved)
          
          return Promise.all([
            EditorSessionsGenerator.generateSessionForManifest(archiveSaved),
            EditorSessionsGenerator.generateSessionForPubMeta(archiveSaved)
          ])
        })
        .then(function(sessions) {
          archiveSaved.setSession("manifest", sessions[0])
          archiveSaved.setSession("pub-meta", sessions[1])
          return EditorSessionsGenerator.generateSessionsForExistingDocuments(archiveSaved)
        })
        .then(function(documentSessions) {
          let existingSessions = archiveSaved.getSessions()
          let finalSessions = Object.assign(existingSessions, documentSessions)
          archiveSaved.setSessions(finalSessions)
          return EditorSessionsValidator.areSessionsValid(finalSessions)
        })
        .then(function(validationResult) {
          if ( !validationResult.isOk() ) {
            reject( validationResult.getErrors() )
          }
              
          resolve(rawArchiveSaved)
        })
        .catch(function(errors) {
          if (platform.inBrowser) {
            window.alert('Exported archive is corrupt!') //eslint-disable-line no-alert
          }

          reject(errors)
        })
    })
  }
}
