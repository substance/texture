import { test } from 'substance-test'
import { DefaultDOMElement as DOM } from 'substance'
import { TextureWebApp, TextureArchive, checkArchive } from 'substance-texture'
import { spy, getMountPoint } from '../testHelpers'
import { applyNOP } from './integrationTestHelpers'

test("Persistence: loading and saving the kitchen-sink article", (t) => {
  t.plan(2)
  let app, archive, manuscriptSession
  let rawArchive
  _setupApp(t)
  .then(res => {
    ({app, archive, manuscriptSession } = res)
    applyNOP(manuscriptSession)
    spy(archive.storage, 'write')
  })
  .then(() => {
    return app._save()
  })
  .then(() => {
    rawArchive = archive.storage.write.args[1]
    return archive.storage.read('kitchen-sink')
  })
  .then(originalRawArchive => {
    // the XML should have actually not changed
    let originalManuscriptXML = originalRawArchive.resources['manuscript.xml'].data
    let newManuscriptXML = rawArchive.resources['manuscript.xml'].data
    // retrieve the rawArchive from the function spy
    rawArchive.resources = Object.assign({}, originalRawArchive.resources, rawArchive.resources)
    let err = checkArchive(TextureArchive, rawArchive)
    let details = err ? err.detail : null
    t.nil(details, 'There should be no error.')
    // just pick the body and see if this is the same
    let oldBodyXML = DOM.parseXML(originalManuscriptXML).find('body').getInnerXML()
    let newBodyXML = DOM.parseXML(newManuscriptXML).find('body').getInnerXML()
    t.equal(newBodyXML, oldBodyXML)
  })
})

function _setupApp(t) {
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
