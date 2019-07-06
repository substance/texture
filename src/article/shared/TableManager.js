import { forEach } from 'substance'
import CitableContentManager from './CitableContentManager'
import TableFootnoteManager from './TableFootnoteManager'

export default class TableManager extends CitableContentManager {
  constructor (editorSession, labelGenerator) {
    super(editorSession, 'table', ['table-figure'], labelGenerator)

    this._updateLabels('initial')

    this._initializeTableFootnoteManagers()
  }

  // EXPERIMENTAL:
  // watching changes and creating a TableFootnoteManager whenever a TableFigure is created
  // We should find a better location, or think about a framework to register such managers in general
  // TableManager does actually not have anything to do with table footnotes.
  _onDocumentChange (change) {
    super._onDocumentChange(change)
    this._checkForNewTableFigures(change)
  }

  // EXPERIMENTAL:
  // ... managers should have hooks to do such stuff
  _initializeTableFootnoteManagers () {
    let doc = this._getDocument()
    let tableFigures = doc.getIndex('type').get('table-figure')
    forEach(tableFigures, tableFigure => {
      tableFigure.setFootnoteManager(new TableFootnoteManager(this.editorSession, tableFigure))
    })
  }

  _checkForNewTableFigures (change) {
    let doc = this._getDocument()
    // whenever a table-figure is created we attach a TableFootnoteManager
    for (let op of change.ops) {
      if (op.isCreate()) {
        let node = doc.get(op.getValue().id)
        if (node && node.type === 'table-figure') {
          node.setFootnoteManager(new TableFootnoteManager(this.document, node))
        }
      }
    }
  }
}
