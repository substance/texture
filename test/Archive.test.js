import { test } from 'substance-test'
import setupTestApp from './shared/setupTestApp'
import { createPseudoFile } from './shared/integrationTestHelpers'

/*
  - test addDocument()
  - test load(): 'version' handling
  - test removeDocument()
  - test saveAs()
  - test blob related impl (missing in nodejs)
    - resolveUrl(): for blobs
    - _save()
*/
test('Archive: add asset', t => {
  let { archive } = setupTestApp(t, { archiveId: 'blank' })
  let FILENAME = 'test.png'
  let file = createPseudoFile(FILENAME, 'image/png')
  let fileName = archive.addAsset(file)
  t.equal(fileName, FILENAME, 'the original file name should be used')
  t.ok(archive.hasAsset(fileName), 'asset should be registered in the archive')
  t.end()
})

test('Archive: adding assets with same name', t => {
  let { archive } = setupTestApp(t, { archiveId: 'blank' })
  let FILENAME = 'test.png'
  let file = createPseudoFile(FILENAME, 'image/png')

  t.comment('adding asset the first time')
  let fileName1 = archive.addAsset(file)
  t.equal(fileName1, FILENAME, 'the original file name should be used')
  t.ok(archive.hasAsset(fileName1), 'asset should be registered in the archive')

  t.comment('adding asset the second time')
  let fileName2 = archive.addAsset(file)
  t.equal(fileName2, 'test_2.png', 'filename should have been changed to be unique')
  t.ok(archive.hasAsset(fileName2), 'asset should be registered in the archive')

  t.end()
})
