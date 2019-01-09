/* global vfs */
import { platform } from 'substance'
import { test } from 'substance-test'
import { TextureArchive, checkArchive } from '../index'
import { getMountPoint, diff } from './shared/testHelpers'
import { applyNOP, toUnix, setupTestVfs, openManuscriptEditor, PseudoFileEvent, getEditorSession, setSelection } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

InvariantLoadSaveTest('blank')

InvariantLoadSaveTest('kitchen-sink')

LoadSaveShouldNotThrow('blank', 'saving and loading an article after inserting a figure', _INSERT_FIGURE)

function InvariantLoadSaveTest (archiveId) {
  test(`Persistence: loading and saving article ${archiveId}`, t => {
    // create a vfs where we can store the data during save without harming the global vfs instance
    let testVfs = setupTestVfs(vfs, archiveId)
    let {app, archive, manuscriptSession} = setupTestApp(t, {
      vfs: testVfs,
      archiveId
    })

    let originalRawArchive
    archive.storage.read(archiveId, (err, rawArchive) => {
      if (err) throw new Error(err)
      originalRawArchive = rawArchive
    })

    // trigger a save
    _NOP({manuscriptSession})

    // Note: with VFS these calls are actually not asynchronous, i.e. calling back instantly
    app._save(err => {
      if (err) throw new Error(err)
    })

    // get the updated raw archive
    let newRawArchive
    archive.storage.read(archiveId, (err, rawArchive) => {
      if (err) throw new Error(err)
      newRawArchive = rawArchive
    })

    let originalManuscriptXML = toUnix(originalRawArchive.resources['manuscript.xml'].data)
    let newManuscriptXML = toUnix(newRawArchive.resources['manuscript.xml'].data)

    // check the new archive for validator errors
    let err = checkArchive(TextureArchive, newRawArchive)
    let details = err ? err.detail : null
    t.nil(details, 'There should be no error.')

    if (newManuscriptXML !== originalManuscriptXML) {
      // we are not using the built-in equal assertion
      // because the error message is not helpful
      // instead we fail with a general message and an extra that
      // will be displayed in the browser
      let msg = 'XML should not have changed'
      if (platform.inBrowser) {
        t._assert(false, {
          message: msg,
          operator: 'equal',
          actual: newManuscriptXML,
          expected: originalManuscriptXML
        })
      } else {
        t.fail(msg)
        console.log('Diff:')
        console.log(diff(newManuscriptXML, originalManuscriptXML))
      }
    } else {
      t.pass('XML did not change')
    }

    // finally try to let the app load the new archive
    getMountPoint(t).empty()
    t.doesNotThrow(() => {
      setupTestApp(t, {
        vfs: testVfs,
        archiveId
      })
    }, 'The persisted file should be loaded and rendered without problems')

    t.end()
  })
}

function LoadSaveShouldNotThrow (archiveId, title, change) {
  test(`Persistence: ${title}`, t => {
    // create a vfs where we can store the data during save without harming the global vfs instance
    let testVfs = setupTestVfs(vfs, archiveId)
    let {app, archive, manuscriptSession} = setupTestApp(t, {
      vfs: testVfs,
      archiveId
    })
    // change the content
    change({app, archive, manuscriptSession})
    // trigger a save
    // Note: with VFS these calls are actually not asynchronous, i.e. calling back instantly
    app._save(err => {
      if (err) throw new Error(err)
    })
    // let the app load the new archive
    getMountPoint(t).empty()
    t.doesNotThrow(() => {
      setupTestApp(t, {
        vfs: testVfs,
        archiveId
      })
    }, 'The persisted file should be loaded and rendered without problems')
    t.end()
  })
}

function _NOP ({manuscriptSession}) {
  applyNOP(manuscriptSession)
}

function _INSERT_FIGURE ({app}) {
  let editor = openManuscriptEditor(app)
  let editorSession = getEditorSession(editor)
  let doc = editorSession.getDocument()
  let p = doc.get('body').getNodeAt(0)
  setSelection(editor, p.getPath(), 0)
  // TODO: more 'transparent' way to create 'files'
  let fe = new PseudoFileEvent()
  editor.send('executeCommand', 'insert-fig', {
    files: fe.currentTarget.files
  })
}
