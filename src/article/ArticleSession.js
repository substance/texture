import { DocumentSession } from '../kit'
import FigureManager from './shared/FigureManager'
import FootnoteManager from './shared/FootnoteManager'
import FormulaManager from './shared/FormulaManager'
import ReferenceManager from './shared/ReferenceManager'
import TableManager from './shared/TableManager'

export default class ArticleSession extends DocumentSession {
  constructor (doc, configurator) {
    super(doc)

    this.footnoteManager = new FootnoteManager(this, configurator.getLabelGenerator('footnotes'))
    this.formulaManager = new FormulaManager(this, configurator.getLabelGenerator('formulas'))
    this.referenceManager = new ReferenceManager(this, configurator.getLabelGenerator('references'))
    this.tableManager = new TableManager(this, configurator.getLabelGenerator('tables'))
    this.figureManager = new FigureManager(this, configurator.getLabelGenerator('figures'))
  }

  getFigureManager () {
    return this.figureManager
  }

  getFootnoteManager () {
    return this.footnoteManager
  }

  getFormulaManager () {
    return this.formulaManager
  }

  getReferenceManager () {
    return this.referenceManager
  }

  getTableManager () {
    return this.tableManager
  }
}
