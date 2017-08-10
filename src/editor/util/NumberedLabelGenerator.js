import { EventEmitter, ObjectOperation, isArrayEqual } from 'substance'
import { getXrefTargets, REF_TYPES, XREF_TARGET_TYPES } from './xrefHelpers'

const { CREATE, DELETE, SET, UPDATE } = ObjectOperation

/*
  @example

  ```js
  let doc = {}
  // NOTE: Supported ref-types are hard-coded for now
  let labelGenerator = new NumberedLabelGenerator(editorSession, this.exporter, {
    'bibr': function(targets) {
      let positions = targets.map(t => t.position)
      return '[' + (positions.join(', ') || '???') + ']'
    },
    'fig': function(targets) {
      let positions = targets.map(t => t.position)
      return 'Figure ' + (positions.join(', ') || '???')
    },
    'table': function(targets) {
      let positions = targets.map(t => t.position)
      return 'Table ' + (positions.join(', ') || '???')
    },
    // E.g. eLife videos are refernced as other
    'other': function(targets) {
      let positions = targets.map(t => t.position)
      return 'Other ' + (positions.join(', ') || '???')
    }
  })

  labelGenerator.getPosition('fig', 'fig-bacteria') => 1
  labelGenerator.getLabel('fig', ['fig-bacteria', 'fig-virus']) => 'Figure 1,2'
  ```
*/
export default class NumberedLabelGenerator extends EventEmitter {

  constructor(editorSession, exporter, refTypes) {
    super()
    this.editorSession = editorSession
    this.document = editorSession.getDocument()
    // refTypes that should be considered e.g.
    this.refTypes = refTypes
    // Holds positions for referenced items
    // e.g. { 'figxyz': 2 }
    this.positions = {}
    this._needsRecompute = {}

    // we use this to determine the order of referenced resources, such as figures
    this.content = editorSession.getDocument().find('article > body > body-content')

    // this is used to detect relevant updates as early as possible
    // before content has been deleted
    this.document.on('operation:applied', this._onOperation, this)
    this.editorSession.onUpdate('document', this._onDocumentChanged, this)
  }

  dispose() {
    this.editorSession.off(this)
  }

  /*
    Returns position for a given target

    @example

    ```js
    getPosition('bibr', 'bib25')
    ```
  */
  getPosition(refType, targetId) {
    return this._getPositions(refType)[targetId]
  }

  /*
    @example

    labelGenerator.getLabel('fig', 'fig1')
  */
  getLabel(refType, targetIds) {
    if (typeof targetIds === 'string') {
      targetIds = [ targetIds ]
    }
    // Compute target objects
    let targets = []
    targetIds.forEach((targetId) => {
      targets.push({
        position: this.getPosition(refType, targetId)
      })
    })
    let result = this.refTypes[refType](targets)
    return result
  }

  /*
    Invalidating the computed positions on certain changes
    - if an ´<xref>´ is created or deleted
    - if the rid attribute of a ´<xref>´ is changed
    - if a ref-type content is inserted into the body

    TODO: this could still be improved. For example,
    for figures and such, `xrefs` do not matter for labelling.
  */
  _onOperation(op) {
    const doc = this.document
    switch (op.type) {
      case CREATE:
      case DELETE: {
        const nodeData = op.val
        // ATTENTION: nodeData does not necessarily contain attributes as they are optional
        if (nodeData.type === 'xref' && nodeData.attributes) {
          const refType = nodeData.attributes['ref-type']
          if (refType) {
            this._needsRecompute[refType] = true
          }
        }
        break
      }
      case UPDATE: {
        if (isArrayEqual(op.path, this.content.getContentPath())) {
          let nodeId = op.diff.val
          let node = doc.get(nodeId)
          const refType = REF_TYPES[node.type]
          if (refType) {
            this._needsRecompute[refType] = true
          }
        }
        break
      }
      case SET: {
        if (op.path[1] === 'attributes' && (op.path[2] === 'rid' || op.path[2] === 'ref-type')) {
          const nodeId = op.path[0]
          const node = doc.get(nodeId)
          if (node && node.type === 'xref') {
            const refType = node.getAttribute('ref-type')
            this._needsRecompute[refType] = true
          }
        }
        break
      }
      default:
        //
    }
  }

  /*
    Determine based on document change whether the labels need to be
    recomputed or not.
  */
  _onDocumentChanged() {
    // recompute positions for all invalidated reftypes
    Object.keys(this._needsRecompute).forEach((refType) => {
      // console.log('Recomputing labels for refType %s', refType)
      this.positions[refType] = this._computePositions(refType)
      delete this._needsRecompute[refType]
      this.emit('labels:generated', refType)
    })
  }

  _computePositions(refType) {
    switch (refType) {
      case 'bibr':
      case 'fn': {
        return this._computePositionsOrderByRef(refType)
      }
      default:
        return this._computePositionsOrderByTarget(refType)
    }
  }

  _computePositionsOrderByRef(refType) {
    const positions = {}
    let counter = 1
    const xrefs = this.document.findAll(`xref[ref-type="${refType}"]`)
    xrefs.forEach((xref) => {
      let targetIds = getXrefTargets(xref)
      targetIds.forEach((targetId) => {
        // if this targetId has been referenced the first time
        // here, we store the current counter as position
        if (!positions.hasOwnProperty(targetId)) {
          positions[targetId] = counter++
        }
      })
    })
    return positions
  }

  _computePositionsOrderByTarget(refType) {
    const positions = {}
    const content = this.content
    const selector = (XREF_TARGET_TYPES[refType] || []).join(',')
    const targets = content.findAll(selector)
    // TODO: there might be targets which should not be included
    // here
    // for now we take all of them
    for (let i = 0; i < targets.length; i++) {
      positions[targets[i].id] = i+1
    }
    return positions
  }

  _getPositions(refType) {
    if (!this.positions[refType]) {
      this.positions[refType] = this._computePositions(refType)
    }
    return this.positions[refType]
  }

}
