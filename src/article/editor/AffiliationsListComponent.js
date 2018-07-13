import { NodeComponent, uniq } from 'substance'
import entityRenderers from '../shared/entityRenderers'

/*
  TODO: find a way to detect updates.

  We need to update this list when a new author has been added or removed, which
  can be auto-detected this.props.node. However it should also
  updates if changes are made to the organisation entries in the entity db.
*/
export default class AffiliationsList extends NodeComponent {

  render($$) {
    let el = $$('div').addClass('sc-affiliations-list')
    let db = this.context.pubMetaDbSession.getDocument()
    let entityIds = this._getOrgansiations()

    let contentEl = $$('div').addClass('se-content')
    entityIds.forEach((entityId, index) => {
      let entity = db.get(entityId)
      contentEl.append(
        $$('span').addClass('se-affiliation').html(
          entityRenderers[entity.type](entity.id, db)
        )
      )
      if (index < entityIds.length - 1) {
        contentEl.append('; ')
      }
    })
    el.append(contentEl)
    return el
  }

  _getAuthors() {
    return this.props.node.findAll('contrib').map(contrib => contrib.getAttribute('rid'))
  }

  _getOrgansiations() {
    let organisations = []
    let db = this.context.pubMetaDbSession.getDocument()
    let authors = this._getAuthors()
    authors.forEach(authorId => {
      let author = db.get(authorId)
      if (!author) {
        console.error('FIXME: no entity for author', authorId)
      } else {
        // We only consider person records
        if (author.type === 'person') {
          organisations = organisations.concat(author.affiliations)
        }
      }
    })
    return uniq(organisations)
  }
}
