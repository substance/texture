import { without } from 'substance'

export default function removeElementAndXrefs(editorSession, elementId, parentElName) {
  let doc = editorSession.getDocument()
  let xrefIndex = doc.getIndex('xrefs')
  let xrefs = xrefIndex.get(elementId)

  if (xrefs.length === 0 || window.confirm(`If you delete this reference, it will also be removed from ${xrefs.length} citations. Are you sure?`)) { // eslint-disable-line
    editorSession.transaction(tx => {
      let parentEl = doc.find(parentElName)
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
    })
  }
}
