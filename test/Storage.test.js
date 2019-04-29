import { testAsync } from 'substance-test'
import { uuid } from 'substance'
import { DarFileStorage, UnpackedDarFolderStorage } from '../index'
import { promisify } from './shared/testHelpers'

// ATTENTION: these tests can not be run in the browser
// because implementation uses filesystem etc.

/*
  TODO:
  - test loading and writing a dar with binaries
  - test loading and saving from and to a folder
  - test HttpStorageClient
*/

const path = require('path')
const fs = require('fs')
const fsExtra = require('fs-extra')

testAsync('Storage: reading a .dar file', async t => {
  let storageDir = _getTmpFolder()
  let darPath = path.join(process.cwd(), 'app-dist', 'templates', 'blank.dar')
  let storage = new DarFileStorage(storageDir)
  let rawArchive = await promisify(cb => {
    storage.read(darPath, cb)
  })
  t.deepEqual(_getResourceNames(rawArchive), ['manifest.xml', 'manuscript.xml'], 'archive should contain correct resources')
  t.end()
})

testAsync('Storage: reading the kitchen-sink.dar', async t => {
  let storageDir = _getTmpFolder()
  let darPath = path.join(process.cwd(), 'app-dist', 'examples', 'kitchen-sink.dar')
  let storage = new DarFileStorage(storageDir)
  let rawArchive = await promisify(cb => {
    storage.read(darPath, cb)
  })
  t.ok(Boolean(rawArchive.resources['manifest.xml']), 'dar should contain manifest')
  t.ok(Boolean(rawArchive.resources['manuscript.xml']), 'dar should contain manuscript')
  t.end()
})

testAsync('Storage: reading a DAR folder', async t => {
  let darPath = path.join(process.cwd(), 'data', 'blank')
  let storage = new UnpackedDarFolderStorage(darPath)
  let rawArchive = await promisify(cb => {
    storage.read(null, cb)
  })
  t.deepEqual(Object.keys(rawArchive.resources), ['manifest.xml', 'manuscript.xml'], 'archive should contain correct resources')
  t.end()
})

testAsync('Storage: cloning a .dar file', async t => {
  let storageDir = _getTmpFolder()
  let storage = new DarFileStorage(storageDir)
  let darPath = path.join(process.cwd(), 'app-dist', 'templates', 'blank.dar')
  await promisify(cb => {
    storage.read(darPath, cb)
  })
  let tmpDir = _getTmpFolder()
  let newDarPath = path.join(tmpDir, 'blank_2.dar')
  await promisify(cb => {
    storage.clone(darPath, newDarPath, cb)
  })
  t.ok(fs.existsSync(newDarPath))
  let rawArchive = await promisify(cb => {
    storage._getRawArchive(newDarPath, cb)
  })
  let resourceNames = Object.keys(rawArchive.resources).sort()
  t.deepEqual(resourceNames, ['manifest.xml', 'manuscript.xml'], 'archive should contain correct resources')
  t.end()
})

testAsync('Storage: cloning the kitchen-sink.dar', async t => {
  let storageDir = _getTmpFolder()
  let storage = new DarFileStorage(storageDir)
  let darPath = path.join(process.cwd(), 'app-dist', 'examples', 'kitchen-sink.dar')
  await promisify(cb => {
    storage.read(darPath, cb)
  })
  let tmpDir = _getTmpFolder()
  let newDarPath = path.join(tmpDir, 'kitchen-sink_2.dar')
  await promisify(cb => {
    storage.clone(darPath, newDarPath, cb)
  })
  t.ok(fs.existsSync(newDarPath))
  let rawArchive = await promisify(cb => {
    storage._getRawArchive(newDarPath, cb)
  })
  t.ok(Boolean(rawArchive.resources['manifest.xml']), 'dar should contain manifest')
  t.ok(Boolean(rawArchive.resources['manuscript.xml']), 'dar should contain manuscript')
  t.end()
})

testAsync('Storage: saving a .dar file', async t => {
  let storageDir = _getTmpFolder()
  let storage = new DarFileStorage(storageDir)
  let darPath = path.join(process.cwd(), 'app-dist', 'templates', 'blank.dar')
  await promisify(cb => {
    storage.read(darPath, cb)
  })
  // Note: creating a clone, so that the original dar does not get affected
  let tmpDir = _getTmpFolder()
  let newDarPath = path.join(tmpDir, 'blank_2.dar')
  await promisify(cb => {
    storage.clone(darPath, newDarPath, cb)
  })
  // TODO: ATM the write API does not validate the format of the given
  // rawArchive. It could do some checking and produce more understandable
  // errors.
  let update = {
    resources: {
      // TODO: storage does not do anything when encoding is not given
      // we should throw an error
      'manuscript.xml': { encoding: 'utf8', data: 'TEST' }
    }
  }
  await promisify(cb => {
    storage.write(newDarPath, update, cb)
  })
  let rawArchive = await promisify(cb => {
    storage._getRawArchive(newDarPath, cb)
  })
  t.equal(rawArchive.resources['manuscript.xml'].data, 'TEST', 'content should have been updated')
  t.end()
})

function _getTmpFolder () {
  let folder = path.join(process.cwd(), 'tmp', uuid())
  fsExtra.ensureDirSync(folder)
  return folder
}

function _getResourceNames (rawArchive) {
  let names = Object.keys(rawArchive.resources)
  names.sort()
  return names
}
