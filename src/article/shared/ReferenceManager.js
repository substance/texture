import { documentHelpers } from 'substance'
import AbstractCitationManager from './AbstractCitationManager'
import NumberedLabelGenerator from './NumberedLabelGenerator'

export default class ReferenceManager extends AbstractCitationManager {
  constructor (documentSession, config) {
    super(documentSession, 'bibr', ['reference'], new NumberedLabelGenerator(config))
    // compute initial labels
    this._updateLabels('initial')
  }

  getBibliography () {
    return this.getSortedCitables()
  }

  hasCitables () {
    let refIds = this._getRefIds()
    return refIds.length > 0
  }

  getCitables () {
    return documentHelpers.getNodesForIds(this._getDocument(), this._getRefIds())
  }

  _getRefIds () {
    let doc = this._getDocument()
    let article = doc.get('article')
    return article.references
  }

  // overriding because 'reference' is just an abstract parent type
  _detectAddRemoveCitable (op, change) {
    if (op.isCreate() || op.isDelete()) {
      // TODO: it would be nice to have real node instances in change
      // to inspect the class/prototype
      let doc = this._getDocument()
      let schema = doc.getSchema()
      return schema.isInstanceOf(op.val.type, 'reference')
    } else {
      return false
    }
  }
}
