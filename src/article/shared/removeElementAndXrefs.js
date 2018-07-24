import { without } from 'substance'

export default function removeElementAndXrefs (articleSession, elementId, parentEl) {
  let doc = articleSession.getDocument()
  let xrefIndex = doc.getIndex('xrefs')
  let xrefs = xrefIndex.get(elementId)

  if (xrefs.length === 0 || window.confirm(`Deleting this will affect ${xrefs.length} citations. Are you sure?`)) { // eslint-disable-line
    articleSession.transaction(tx => {
      let node = tx.get(elementId)
      // ATTENTION: it is important to nodes from the transaction tx!
      // Be careful with closures here.
      parentEl = tx.get(parentEl.id)
      parentEl.removeChild(node)
      tx.delete(node.id)
      // Now update xref targets
      xrefs.forEach((xrefId) => {
        let xref = tx.get(xrefId)
        let idrefs = xref.attr('rid').split(' ')
        idrefs = without(idrefs, elementId)
        xref.setAttribute('rid', idrefs.join(' '))
      })
      tx.setSelection(null)
    })
  }
}
