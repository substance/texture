import { isString, ObjectOperation, DocumentChange } from 'substance'

export function setCursor(editorSession, path, pos) {
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

export function insertText(editorSession, text) {
  editorSession.transaction(tx => {
    tx.insertText(text)
  })
}

export function applyNOP(editorSession) {
  editorSession._commit(new DocumentChange([new ObjectOperation({ type: "NOP" })], {}, {}), {})
}