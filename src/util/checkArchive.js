import EditorSessionsGenerator from "../sessions/EditorSessionsGenerator"
import EditorSessionsValidator from "../sessions/EditorSessionsValidator"

export default function checkLoadArchive(ArchiveClass, documentArchiveConfig, rawArchive) {
  
  let testArchive = new ArchiveClass(documentArchiveConfig)
  testArchive.setUpstreamArchive(rawArchive)

  return new Promise(function(resolve, reject) {
    Promise.all([
      EditorSessionsGenerator.generateSessionForManifest(testArchive),
      EditorSessionsGenerator.generateSessionForPubMeta(testArchive)
    ])
      .then(function(sessions) {
        testArchive.setSession("manifest", sessions[0])
        testArchive.setSession("pub-meta", sessions[1])
        return EditorSessionsGenerator.generateSessionsForExistingDocuments(testArchive)
      })
      .then(function(documentSessions) {
        let existingSessions = testArchive.getSessions()
        let finalSessions = Object.assign(existingSessions, documentSessions)
        return EditorSessionsValidator.areSessionsValid(finalSessions)
      })
      .then(function(validationResult) {
        if ( !validationResult.isOk() ) {
          reject( validationResult.getErrors() )
        }
        
        resolve(validationResult)
      })
      .catch(function(errors) {
        reject(errors)
      })
  })
}