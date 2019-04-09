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

    this.figureManager = new FigureManager(this, articleConfig.get('figure-label-generator'))
    this.footnoteManager = new FootnoteManager(this, articleConfig.get('footnote-label-generator'))
    this.formulaManager = new FormulaManager(this, articleConfig.get('formula-label-generator'))
    this.referenceManager = new ReferenceManager(this, articleConfig.get('reference-label-generator'))
    this.supplementaryManager = new SupplementaryManager(this, articleConfig.get('supplementary-file-label-generator'))
    this.tableManager = new TableManager(this, articleConfig.get('table-label-generator'))
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
