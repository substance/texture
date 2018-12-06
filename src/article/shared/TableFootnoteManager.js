import { isArray } from 'substance'
import AbstractCitationManager from './AbstractCitationManager'

const SYMBOLS = ['*', '†', '‡', '§', '‖', '¶']
const UNDEFINED = '?'

export default class TableFootnoteManager extends AbstractCitationManager {
  constructor (documentSession, tableFigure) {
    super(documentSession, 'table-fn')

    this.tableFigure = tableFigure
    // TODO: this should be configurable
    this.labelGenerator = new SymbolSetLabelGenerator(SYMBOLS)

    this._updateLabels('silent')
  }

  _getContentElement () {
    return this.tableFigure
  }

  hasCitables () {
    return (this.tableFigure.footnotes && this.tableFigure.footnotes.length > 0)
  }

  getCitables () {
    let doc = this._getDocument()
    let footnotes = this.tableFigure.footnotes
    if (footnotes) {
      return footnotes.map(id => doc.get(id))
    } else {
      return []
    }
  }

  _getCollectionElement () {
    // HACK: the base implementation assumes that the collection is dedicated node, not just a property
    // FIXME: find a way to make this path based, instead of node based.
    return null
  }
}

class SymbolSetLabelGenerator {
  constructor (symbols) {
    this.symbols = Array.from(symbols)
  }

  getLabel (pos) {
    if (isArray(pos)) {
      return pos.map(p => this._getSymbolForPos(p)).join(', ')
    } else {
      return this._getSymbolForPos(pos)
    }
  }

  _getSymbolForPos (pos) {
    return this.symbols[pos - 1] || UNDEFINED
  }
}
