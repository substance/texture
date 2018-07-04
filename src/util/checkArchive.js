import EditorSessionsGenerator from "../editor/util/EditorSessionsGenerator"
import EditorSessionsValidator from "../editor/util/EditorSessionsValidator"

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
        let editorSessionsValidator = new EditorSessionsValidator()
        return editorSessionsValidator.areSessionsValid(finalSessions)
      })
      .then(function(validatedSessions) {
        resolve(validatedSessions)
      })
      .catch(function(errors) {
        reject(errors)
      })
  })
}