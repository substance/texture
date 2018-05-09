import { test } from 'substance-test'
import { isString } from 'substance'
import { TextureWebApp, TextureArchive, checkArchive } from 'substance-texture'
import { spy, getMountPoint } from '../testHelpers'

test("Integration: loading and saving the kitchen-sink article", (t) => {
  t.plan(1)
  let app, archive, manuscriptSession
  let rawArchive
  _setupApp(t)
  .then((res) => {
    ({app, archive, manuscriptSession} = res)
    setCursor(manuscriptSession, 'p-1.content', 0)
    insertText(manuscriptSession, 'foo')
    spy(archive.storage, 'write')
  })
  .then(() => app._save())
  .then(() => {
    rawArchive = archive.storage.write.args[1]
    return archive.storage.read('kitchen-sink')
  })
  .then(originalRawArchive => {
    // retrieve the rawArchive from the function spy
    rawArchive.resources = Object.assign({}, originalRawArchive.resources, rawArchive.resources)
    let err = checkArchive(TextureArchive, rawArchive)
    let details = err ? err.detail : null
    t.nil(details, 'There should be no error.')
  })
})

function _setupApp(t) {
  let app
  return new Promise((resolve, reject) => {
    let App = createTestApp(resolve, reject)
    let el = getMountPoint(t)
    console.log('##### t.sandbox')
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


function createTestApp(resolve, reject) {
  class App extends TextureWebApp {

    didMount() {
      super.didMount()

    }

    willUpdateState(newState) {
      if (newState.archive) {
        resolve(newState.archive)
      } else if (newState.error) {
        reject(newState.error)
      }
    }
  }
  return App
}

function setCursor(editorSession, path, pos) {
  if (isString(path)) path = path.split('.')
  let doc = editorSession.getDocument()
  let node = doc.get(path[0])
  editorSession.setSelection({
    type: 'property',
    path,
    startOffset: pos,
    endOffset: pos,
    surfaceId: node.parentNode.id
  })
}

function insertText(editorSession, text) {
  editorSession.transaction(tx => {
    tx.insertText(text)
  })
}