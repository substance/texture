import { MemoryDOMElement } from 'substance'
import { TextureArchive, checkArchive } from '../index'
import { spy, testAsync, _async } from './testHelpers'
import { applyNOP, toUnix } from './integrationTestHelpers'
import setupTestApp from './setupTestApp'

testAsync('Persistence: loading and saving the kitchen-sink article', async (t) => {
  let res = setupTestApp(t)
  let {app, archive, manuscriptSession} = res
  applyNOP(manuscriptSession)
  spy(archive.storage, 'write')
  await _async(cb => {
    app._save(cb)
  })
  let rawArchive = archive.storage.write.args[1]
  let originalRawArchive = await _async(cb => {
    archive.storage.read('kitchen-sink', cb)
  })
  // the XML should have actually not changed
  let originalManuscriptXML = originalRawArchive.resources['manuscript.xml'].data
  let newManuscriptXML = rawArchive.resources['manuscript.xml'].data
  // retrieve the rawArchive from the function spy
  rawArchive.resources = Object.assign({}, originalRawArchive.resources, rawArchive.resources)
  let err = checkArchive(TextureArchive, rawArchive)
  let details = err ? err.detail : null
  t.nil(details, 'There should be no error.')
  // just pick the front and see if this is the same
  let oldFrontXML = MemoryDOMElement.parseMarkup(originalManuscriptXML, 'xml').find('front').getInnerXML()
  let newFrontXML = MemoryDOMElement.parseMarkup(newManuscriptXML, 'xml').find('front').getInnerXML()
  // Note: we must make sure to compare strings with comparable line-endings
  t.equal(toUnix(newFrontXML), toUnix(oldFrontXML), 'Front should be the same after saving')
  // pick the body and see if the innerXML is the same
  let oldBodyXML = MemoryDOMElement.parseMarkup(originalManuscriptXML, 'xml').find('body').getInnerXML()
  let newBodyXML = MemoryDOMElement.parseMarkup(newManuscriptXML, 'xml').find('body').getInnerXML()
  // Note: we must make sure to compare strings with comparable line-endings
  t.equal(toUnix(newBodyXML), toUnix(oldBodyXML), 'Body should be the same after saving')
  // just pick the back and see if this is the same
  let oldBackXML = MemoryDOMElement.parseMarkup(originalManuscriptXML, 'xml').find('back').getInnerXML()
  let newBackXML = MemoryDOMElement.parseMarkup(newManuscriptXML, 'xml').find('back').getInnerXML()
  // Note: we must make sure to compare strings with comparable line-endings
  t.equal(toUnix(newBackXML), toUnix(oldBackXML), 'Back should be the same after saving')
  t.end()
})
