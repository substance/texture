import { getMountPoint } from './testHelpers'
import { createTestApp } from './integrationTestHelpers'

export default function setupTestApp (t) {
  let app
  return new Promise((resolve, reject) => {
    let App = createTestApp(resolve, reject)
    let el = getMountPoint(t)
    app = App.mount({
      archiveId: 'kitchen-sink',
      storageType: 'vfs'
    }, el)
  }).then(archive => {
    let manifestSession = archive.getEditorSession('manifest')
    let manuscriptSession = archive.getEditorSession('manuscript')
    return { app, archive, manifestSession, manuscriptSession }
  })
}
