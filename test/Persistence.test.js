/* global vfs */
import { MemoryDOMElement } from 'substance'
import { test } from 'substance-test'
import { TextureArchive, checkArchive } from '../index'
import { getMountPoint } from './testHelpers'
import { applyNOP, toUnix, setupTestVfs } from './integrationTestHelpers'
import setupTestApp from './setupTestApp'

test('Persistence: loading and saving the kitchen-sink article', t => {
  // create a vfs where we can store the data during save without harming the global vfs instance
  let archiveId = 'kitchen-sink'
  let testVfs = setupTestVfs(vfs, archiveId)
  let {app, archive, manuscriptSession} = setupTestApp(t, {
    vfs: testVfs,
    archiveId
  })

  let originalRawArchive
  archive.storage.read('kitchen-sink', (err, rawArchive) => {
    if (err) throw new Error(err)
    originalRawArchive = rawArchive
  })

  // trigger a save
  applyNOP(manuscriptSession)
  // Note: with VFS these calls are actually not asynchronous, i.e. calling back instantly
  app._save(err => {
    if (err) throw new Error(err)
  })

  // get the updated raw archive
  let newRawArchive
  archive.storage.read('kitchen-sink', (err, rawArchive) => {
    if (err) throw new Error(err)
    newRawArchive = rawArchive
  })

  let originalManuscriptXML = originalRawArchive.resources['manuscript.xml'].data
  let newManuscriptXML = newRawArchive.resources['manuscript.xml'].data

  // check the new archive for validator errors
  let err = checkArchive(TextureArchive, newRawArchive)
  let details = err ? err.detail : null
  t.nil(details, 'There should be no error.')

  // TODO: shouldn't be the whole XML the same?

  // compare front
  let oldFrontXML = MemoryDOMElement.parseMarkup(originalManuscriptXML, 'xml').find('front').getInnerXML()
  let newFrontXML = MemoryDOMElement.parseMarkup(newManuscriptXML, 'xml').find('front').getInnerXML()
  // Note: we must make sure to compare strings with comparable line-endings
  t.equal(toUnix(newFrontXML), toUnix(oldFrontXML), 'Front should be the same after saving')

  // compare body
  let oldBodyXML = MemoryDOMElement.parseMarkup(originalManuscriptXML, 'xml').find('body').getInnerXML()
  let newBodyXML = MemoryDOMElement.parseMarkup(newManuscriptXML, 'xml').find('body').getInnerXML()
  // Note: we must make sure to compare strings with comparable line-endings
  t.equal(toUnix(newBodyXML), toUnix(oldBodyXML), 'Body should be the same after saving')

  // compare back
  let oldBackXML = MemoryDOMElement.parseMarkup(originalManuscriptXML, 'xml').find('back').getInnerXML()
  let newBackXML = MemoryDOMElement.parseMarkup(newManuscriptXML, 'xml').find('back').getInnerXML()
  // Note: we must make sure to compare strings with comparable line-endings
  t.equal(toUnix(newBackXML), toUnix(oldBackXML), 'Back should be the same after saving')

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
