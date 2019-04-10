import { DocumentSession } from 'substance'
import FigureManager from './shared/FigureManager'
import FootnoteManager from './shared/FootnoteManager'
import FormulaManager from './shared/FormulaManager'
import ReferenceManager from './shared/ReferenceManager'
import TableManager from './shared/TableManager'
import SupplementaryManager from './shared/SupplementaryManager'

export default class ArticleSession extends DocumentSession {
  constructor (doc, articleConfig) {
    super(doc)

    this.figureManager = new FigureManager(this, articleConfig.getValue('figure-label-generator'))
    this.footnoteManager = new FootnoteManager(this, articleConfig.getValue('footnote-label-generator'))
    this.formulaManager = new FormulaManager(this, articleConfig.getValue('formula-label-generator'))
    this.referenceManager = new ReferenceManager(this, articleConfig.getValue('reference-label-generator'))
    this.supplementaryManager = new SupplementaryManager(this, articleConfig.getValue('supplementary-file-label-generator'))
    this.tableManager = new TableManager(this, articleConfig.getValue('table-label-generator'))
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
