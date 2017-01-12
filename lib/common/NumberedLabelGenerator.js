import { EventEmitter } from 'substance'

/*
  @example

  ```js
  let doc = {}
  let labelGenerator = new NumberedLabelGenerator(doc, {
    'bibr': function(targets) {
      let positions = targets.map(t => t.position)
      return '[' + positions.join(', ') + ']'
    },
    'fig': function(targets) {
      let positions = targets.map(t => t.position)
      return 'Figure ' + positions.join(', ')
    },
    'table': function(pos) {
      return 'Table ' + pos
    }
  })

  labelGenerator.getPosition('fig', 'fig-bacteria') => 1
  labelGenerator.getLabel('fig', ['fig-bacteria', 'fig-virus']) => 'Figure 1,2'
  ```
*/
class NumberedLabelGenerator extends EventEmitter {
  constructor(editorSession, exporter, refTypes) {
    super()
    this.editorSession = editorSession
    this.document = editorSession.getDocument()
    this.exporter = exporter
    // refTypes that should be considered e.g.
    this.refTypes = refTypes
    // Holds positions for referenced items
    // e.g. { 'figxyz': 2 }
    this.positions = {}
    // initial computation
    this._computePositions()
    this.editorSession.onUpdate('document', this._onDocumentChanged, this)
  }

  dispose() {
    this.editorSession.off(this)
  }

  /*
    Determine based on document change whether the labels need to be
    recomputed or not.
  */
  _onDocumentChanged(change) {
    let doc = this.document
    let needsRecompute = false

    // NOTE: We don't recompute on new xrefs as they have targets = [] by
    // default

    // When an xref is deleted we need to recompute labels
    Object.keys(change.deleted).forEach((nodeId) => {
      var node = doc.get(nodeId)
      if (node && node.type === 'xref') {
        needsRecompute = true
      }
    })
    // When an xref the targets property of an xref is updated we recompute
    Object.keys(change.updated).forEach((nodeId) => {
      var node = doc.get(nodeId)
      if (node && node.type === 'xref' && change.isAffected([nodeId, 'targets'])) {
        needsRecompute = true
      }
    })

    if (needsRecompute) {
      this._computePositions()
    }
  }

  _computePositions() {
    // Reset positions
    this.positions = {}
    Object.keys(this.refTypes).forEach((refType) => {
      this.positions[refType] = {}
    })

    // Init Counters
    let counters = {}
    Object.keys(this.refTypes).forEach((refType) => {
      counters[refType] = 0
    })

    // We use the information from the JATS representatation of the
    // document in order to determine the order of xrefs
    let articleEl = this.exporter.exportDocument(this.document)
    let xrefs = articleEl.findAll('xref')

    xrefs.forEach((xref) => {
      // Skip elements that have no target assinged
      if (!xref.attr('rid')) {
        return
      }
      let targetIds = xref.attr('rid').split(' ')
      let refType = xref.attr('ref-type')
      if (!this.refTypes[refType]) {
        return
      }

      targetIds.forEach((targetId) => {
        if (!this.positions[refType][targetId]) {
          // Increment counter and use as new pos
          let pos = ++counters[refType]
          this.positions[refType][targetId] = pos
        }
      })
    })
    this.emit('labels:generated')
    // console.info('positions', this.positions)
  }

  /*
    Returns position for a given target

    @example

    ```js
    getPosition('bibr', 'bib25')
    ```
  */
  getPosition(refType, targetId) {
    return this.positions[refType][targetId]
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
}

export default NumberedLabelGenerator
