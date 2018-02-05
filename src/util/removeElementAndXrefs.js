import { without } from 'substance'

export default function removeElementAndXrefs(editorSession, elementId, parentEl) {
  let doc = editorSession.getDocument()
  let xrefIndex = doc.getIndex('xrefs')
  let xrefs = xrefIndex.get(elementId)

  if (xrefs.length === 0 || window.confirm(`Deleting this will affect ${xrefs.length} citations. Are you sure?`)) { // eslint-disable-line
    editorSession.transaction(tx => {
      let node = doc.get(elementId)
      parentEl.removeChild(node)
      tx.delete(node.id)
      // Now update xref targets
      xrefs.forEach((xrefId) => {
        let xref = doc.get(xrefId)
        let idrefs = xref.attr('rid').split(' ')
        idrefs = without(idrefs, elementId)
        xref.setAttribute('rid', idrefs.join(' '))
      })
      tx.setSelection(null)
    })
  }
}
