import { DocumentChange, without } from 'substance'
import updateEntityChildArray from '../../util/updateEntityChildArray'

export default class ReferenceManager {

  constructor(editorSession, entityDbSession) {
    this.editorSession = editorSession
    this.entityDbSession = entityDbSession

    // this will be determined by taking the
    // position by entity id
    this._order = null
    // label by citation id
    this._labels = null

    this.editorSession.onUpdate('document', this._onDocumentChange, this)

    // compute initial labels
    this._updateCitationLabels()
  }

  dispose() {
    this.editorSession.off(this)
  }

  updateReferences(newRefs) {
    let refList = this.editorSession.getDocument().find('ref-list')
    let oldRefs = this.getReferenceIds()
    updateEntityChildArray(this.editorSession, refList.id, 'ref', 'rid', oldRefs, newRefs)
  }

  getReferenceIds() {
    let doc = this.editorSession.getDocument()
    let refs = doc.findAll('ref-list > ref')
    return refs.map(ref => ref.getAttribute('rid'))
  }

  /*
    Returns a list of formatted citations including labels
  */
  getBibliography() {
    let entityDb = this.entityDbSession.getDocument()
    let refs = this.getReferenceIds()

    // TODO: determine order and label based on citations in the document
    return refs.map((refId, index) => {
      let entity = entityDb.get(refId)
      return {
        id: refId,
        label: index + 1,
        type: entity.type
      }
    })
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
          if (op.val.type === 'xref' && op.val.attributes && op.val.attributes['ref-type'] === 'bibr') {
            needsUpdate = true
          }
          break
        }
        case 'set': {
          if (op.path[1] === 'attributes') {
            // II. citation has been created, i.e. ref-type has been set to 'bibr' (or vice versa)
            if (op.path[2] === 'ref-type' && (op.val === 'bibr' || op.original === 'bibr')) {
              needsUpdate = true
            }
            // III. the references of a citation have been updated
            else if (op.path[2] === 'rid') {
              let node = doc.get(op.path[0])
              if (node && node.getAttribute('ref-type') === 'bibr') {
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
        this._updateCitationLabels()
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
  _updateCitationLabels() {
    const editorSession = this.editorSession
    const doc = editorSession.getDocument()
    let citations = doc.findAll("xref[ref-type='bibr']")
    if (citations.length === 0) return

    let pos = 1
    let order = {}
    let labels = {}
    citations.forEach((cite) => {
      let label = []
      let rids = cite.getAttribute('rid').split(' ')
      rids.forEach((id) => {
        if (!order.hasOwnProperty(id)) {
          order[id] = pos++
        }
        label.push(order[id])
      })
      label.sort()
      labels[cite.id] = `[${label.join(',')}]` || '???'
    })

    // Now update the node state of all affected xref[ref-type='bibr']
    // TODO: we need a node state API
    // provided via editor session
    let change = new DocumentChange([], {}, {})
    change._extractInformation()
    citations.forEach((cite) => {
      const label = labels[cite.id]
      if (!cite.state) {
        cite.state = {}
      }
      cite.state.label = label
      change.updated[cite.id] = true
    })
    editorSession._setDirty('document')
    editorSession._setDirty('commandStates')
    editorSession._change = change
    editorSession._info = {}
    editorSession.startFlow()
  }

}
