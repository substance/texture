import { DocumentSession } from 'substance'
import FigureManager from './shared/FigureManager'
import FootnoteManager from './shared/FootnoteManager'
import FormulaManager from './shared/FormulaManager'
import ReferenceManager from './shared/ReferenceManager'
import TableManager from './shared/TableManager'
import SupplementaryManager from './shared/SupplementaryManager'

export default class ArticleSession extends DocumentSession {
  constructor (doc, config) {
    super(doc)

    this.figureManager = new FigureManager(this, config.getLabelGenerator('figures'))
    this.footnoteManager = new FootnoteManager(this, config.getLabelGenerator('footnotes'))
    this.formulaManager = new FormulaManager(this, config.getLabelGenerator('formulas'))
    this.referenceManager = new ReferenceManager(this, config.getLabelGenerator('references'))
    this.supplementaryManager = new SupplementaryManager(this, config.getLabelGenerator('supplementaries'))
    this.tableManager = new TableManager(this, config.getLabelGenerator('tables'))
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

  getSupplementaryManager () {
    return this.supplementaryManager
  }
}
