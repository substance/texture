import DefaultModel from './DefaultModel'
import { getXrefLabel } from '../shared/xrefHelpers'
import { renderEntity } from '../shared/entityHelpers'

// TODO: Delete this is obsolete

export default class ReferencesModel extends DefaultModel {

  addReference(ref) {
    console.warn(`TODO: Implement ref insertion ${ref}`)
  }

  /*
    Retrieve a plain object representing a reference in the article
  */
  getReference(id) {
    let doc = this.context.doc
    let ref = doc.get(id)
    if (!ref) {
      console.warn(`Reference ${id} not found.`)
      return undefined
    }
    let entityId = ref.attr('rid')
    let entity = this.context.pubMetaDb.get(entityId)
    if (!entity) {
      console.warn(`No db entry found for ${entityId}.`)
      return undefined
    }

    let result = entity.toJSON()
    // We only communicate the local reference id (as seen in the XML)
    result.id = id
    return result
  }

  getLabel(id) {
    let doc = this.context.doc
    let ref = doc.get(id)
    return getXrefLabel(ref)
  }

  /*
    Render reference as HTML
  */
  renderReference(id) {
    let entity = this._getEntityForRef(id)
    return renderEntity(entity)
  }

  /*
    Get a complete bibliography object, ready for display
  */
  getBibliography() {
    let refNodes = this.context.referenceManager.getBibliography()
    let result = []
    refNodes.forEach(refNode => {
      result.push({
        id: refNode.id,
        label: refNode.state.label,
        html: this.renderReference(refNode.id)
      })
    })
    return result
  }

  /*
    Return references collection. This is used for editing (e.g. in the MetadataEditor)
  */
  getReferences() {
    let refNodes = this.context.referenceManager.getBibliography()
    let result = []
    refNodes.forEach(refNode => {
      result.push(
        this.getReference(refNode.id)
      )
    })
    return result
  }

  _getEntityForRef(id) {
    let doc = this.context.doc
    let ref = doc.get(id)
    let entity = this.context.pubMetaDb.get(ref.attr('rid'))
    return entity
  }

}