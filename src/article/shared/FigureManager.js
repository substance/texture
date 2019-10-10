import CitableContentManager from './CitableContentManager'

export default class FigureManager extends CitableContentManager {
  constructor (editorSession, labelGenerator) {
    super(editorSession, 'fig', ['figure'], labelGenerator)
    this._updateLabels('initial')
  }

  static create (context) {
    const { editorSession, config } = context
    return new FigureManager(editorSession, config.getValue('figure-label-generator'))
  }

  _detectAddRemoveCitable (op, change) {
    return super._detectAddRemoveCitable(op, change)
  }

  _getItemSelector () {
    return 'figure'
  }

  _computeTargetUpdates () {
    let figures = this._getContentElement().findAll('figure')
    let records = {}
    // Iterate through all figures and their panels
    // and generate a record for every item that should be updated
    // leave any information necessary to control the label generator
    let figureCounter = 1
    for (let figure of figures) {
      let id = figure.id
      let pos = [{ pos: figureCounter }]
      let label = this.labelGenerator.getSingleLabel(pos)
      records[id] = { id, pos, label }
      figureCounter++
    }
    return records
  }
}
