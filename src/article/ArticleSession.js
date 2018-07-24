import { DocumentSession } from '../shared'
import FigureManager from './shared/FigureManager'
import FootnoteManager from './shared/FootnoteManager'
import ReferenceManager from './shared/ReferenceManager'
import TableManager from './shared/TableManager'

export default class ArticleSession extends DocumentSession {
  constructor (doc, configurator) {
    super(doc)

    this.figureManager = new FigureManager(doc, configurator.getLabelGenerator('figures'))
    this.footnoteManager = new FootnoteManager(doc, configurator.getLabelGenerator('footnotes'))
    this.referenceManager = new ReferenceManager(doc, configurator.getLabelGenerator('references'))
    this.tableManager = new TableManager(doc, configurator.getLabelGenerator('tables'))
  }

  getFigureManager () {
    return this.figureManager
  }

  getFootnoteManager () {
    return this.footnoteManager
  }

  getReferenceManager () {
    return this.referenceManager
  }

  getTableManager () {
    return this.tableManager
  }
}
