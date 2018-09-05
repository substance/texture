import { getMountPoint } from './testHelpers'
import { createTestApp } from './integrationTestHelpers'

export default function setupTestApp (t, options = {}) {
  // TODO: this is a little weird. Maybe just pass App as
  let el = getMountPoint(t)
  let archiveId = options.archiveId || 'kitchen-sink'
  let App = createTestApp(options)
  // TODO: use options here
  let app = App.mount({
    archiveId,
    storageType: 'vfs'
  }, el)
  // ATTENTION: in the test suite everything works synchronously
  // even despite the API beyond asynchronous
  if (app.state.error) {
    throw new Error(app.state.error)
  } else {
    let archive = app.state.archive
    let manifestSession = archive.getEditorSession('manifest')
    let manuscriptSession = archive.getEditorSession('manuscript')
    return { app, archive, manifestSession, manuscriptSession }
  }
}
