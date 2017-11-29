import { DocumentChange } from 'substance'

export default class AbstractCitationManager {

  constructor(editorSession, type, labelGenerator) {
    this.editorSession = editorSession

    if(!this.editorSession) {
      throw new Error("'editorSession' is mandatory.")
    }

    this.type = type
    this.labelGenerator = labelGenerator

    this.editorSession.onUpdate('document', this._onDocumentChange, this)
  }

  dispose() {
    this.editorSession.off(this)
  }

  _onDocumentChange(change) {
    const doc = this.editorSession.getDocument()

    // updateCitationLabels whenever
    // I.   an xref[ref-type='bibr'] is created or deleted
    // II.  the ref-type attribute of an xref is set to 'bibr' (creation)
    // II. the rid attribute of an xref with ref-type bibr is updated
    const ops = change.ops
    let needsUpdate = false
    for (var i = 0; i < ops.length; i++) {
      let op = ops[i]
      switch (op.type) {
        // I. citation is created or deleted
        case 'delete':
        case 'create': {
          if (op.val.type === 'xref' && op.val.attributes && op.val.attributes['ref-type'] === this.type) {
            needsUpdate = true
          }
          break
        }
        case 'set': {
          if (op.path[1] === 'attributes') {
            // II. citation has been created, i.e. ref-type has been set to 'bibr' (or vice versa)
            if (op.path[2] === 'ref-type' && (op.val === this.type || op.original === this.type)) {
              needsUpdate = true
            }
            // III. the references of a citation have been updated
            else if (op.path[2] === 'rid') {
              let node = doc.get(op.path[0])
              if (node && node.getAttribute('ref-type') === this.type) {
                needsUpdate = true
              }
            }
          }

          break
        }
        default:
          //
      }
      if (needsUpdate) break
    }
    if (needsUpdate) {
      // we should not do this in a flow
      // TODO: we need the ability to update the node state
      // either triggering a new flow, but also during a running flow
      setTimeout(() => {
        this._updateLabels()
      })
    }
  }

  /*
    Label of bibliographic entries are determined
    by the order of their citations in the document.
    I.e. typically you pick all citations (`<xref>`) as they
    occur in the document, and provide the ids of the entries
    they refer to. This forms a list of tuples, such as:
    ```
      [
        { id: 'cite1', refs: [AB06, Mac10] },
        { id: 'cite2', refs: [FW15] },
        { id: 'cite3', refs: [Mac10, AB06, AB07] }
      ]
    ```

    @param {Array<Object>} a list of citation entries.
  */
  _updateLabels() {
    const editorSession = this.editorSession
    const doc = editorSession.getDocument()

    let refList = doc.find('ref-list')
    let xrefs = doc.findAll(`xref[ref-type='${this.type}']`)

    let pos = 1
    let order = {}
    let refLabels = {}
    let xrefLabels = {}
    xrefs.forEach((xref) => {
      let numbers = []
      let rids = xref.getAttribute('rid').split(' ')
      rids.forEach((id) => {
        if (!order.hasOwnProperty(id)) {
          order[id] = pos++
          refLabels[id] = this.labelGenerator.getLabel(order[id])
        }
        numbers.push(order[id])
      })
      xrefLabels[xref.id] = this.labelGenerator.getLabel(numbers)
    })

    // Now update the node state of all affected xref[ref-type='bibr']
    // TODO: we need a node state API
    // provided via editor session
    let change = new DocumentChange([], {}, {})
    change._extractInformation()
    xrefs.forEach((xref) => {
      const label = xrefLabels[xref.id]
      if (!xref.state) {
        xref.state = {}
      }
      xref.state.label = label
      change.updated[xref.id] = true
    })
    let refs = this._getReferences()
    refs.forEach((ref) => {
      const label = refLabels[ref.id]
      if (!ref.state) {
        ref.state = {}
      }
      ref.state.label = label || ''
      ref.state.pos = order[ref.id]
      change.updated[ref.id] = true
    })
    // Note: also mimick a change to ref-list
    // to trigger an update
    change.updated[refList.id] = true

    editorSession._setDirty('document')
    editorSession._change = change
    editorSession._info = {}
    editorSession.startFlow()
  }

}
