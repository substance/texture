/* global vfs */
import { ObjectOperation, DocumentChange, isString } from 'substance'
import { TextureWebApp, VfsStorageClient } from '../index'

export function setCursor (editor, path, pos) {
  if (!isString(path)) {
    path = path.join('.')
  }
  let property = editor.find(`.sc-text-property[data-path=${path.replace('.', '\\.')}]`)
  if (!property) {
    throw new Error('Could not find text property for path ' + path)
  }
  let editorSession = editor.context.editorSession
  let surface = property.context.surface
  editorSession.setSelection({
    type: 'property',
    path: path.split('.'),
    startOffset: pos,
    surfaceId: surface.id,
    containerId: surface.containerId
  })
}

export function insertText (editorSession, text) {
  editorSession.transaction(tx => {
    tx.insertText(text)
  })
}

export function applyNOP (editorSession) {
  editorSession._commit(new DocumentChange([new ObjectOperation({ type: 'NOP' })], {}, {}), {})
}

export function toUnix (str) {
  return str.replace(/\r?\n/g, '\n')
}

export function createTestApp (options = {}) {
  class App extends TextureWebApp {
    _getStorage (storageType) {
      let _vfs = options.vfs || vfs
      let _rootFolder = options.root || './data/'
      return new VfsStorageClient(_vfs, _rootFolder)
    }

    willUpdateState (newState) {
      if (newState.archive) {
        this.emit('archive:ready', newState.archive)
      } else if (newState.error) {
        this.emit('archive:failed', newState.error)
      }
    }
  }
  return App
}
