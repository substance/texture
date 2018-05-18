import { isString, ObjectOperation, DocumentChange } from 'substance'
import { TextureWebApp } from 'substance-texture'

export function setCursor (editorSession, path, pos) {
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

export function createTestApp (resolve, reject) {
  class App extends TextureWebApp {
    willUpdateState (newState) {
      if (newState.archive) {
        resolve(newState.archive)
      } else if (newState.error) {
        reject(newState.error)
      }
    }
  }
  return App
}
