import { EventEmitter } from 'substance'
import { getXrefTargets, XREF_TARGET_TYPES } from './xrefHelpers'

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
    Determine based on document change whether the labels need to be
    recomputed or not.
  */
  _onDocumentChanged(change) {
    const doc = this.document
    let needsRecompute = {}

    // When an xref is deleted we need to recompute labels
    const affected = Object.assign({}, change.deleted, change.created)
    Object.keys(affected).forEach((nodeId) => {
      const nodeData = affected[nodeId]
      if (nodeData && nodeData.type === 'xref') {
        // console.log('Created or deleted xref')
        // ATTENTION: for deleted nodes we don't get a rich
        // node instance object anymore, only the data record.
        const refType = nodeData.attributes['ref-type']
        needsRecompute[refType] = true
      }
    })
    // When the targets property of an xref is updated we recompute
    Object.keys(change.updated).forEach((nodeId) => {
      const node = doc.get(nodeId)
      if (node && node.type === 'xref' && change.hasUpdated([nodeId, 'attributes', 'rid'])) {
        const refType = node.attributes['ref-type']
        needsRecompute[refType] = true
      }
    })
    // recompute positions for all invalidated reftypes
    Object.keys(needsRecompute).forEach((refType) => {
      // console.log('Recomputing labels for refType %s', refType)
      this.positions[refType] = this._computePositions(refType)
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
    const article = this.document.get('article')
    const body = article.findChild('body')
    const selector = (XREF_TARGET_TYPES[refType] || []).join(',')
    const targets = body.findAll(selector)
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
