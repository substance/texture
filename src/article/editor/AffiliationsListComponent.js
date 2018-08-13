import { uniq } from 'substance'
import NodeComponent from '../shared/NodeComponent'
import renderEntity from '../shared/renderEntity'

/*
  TODO: find a way to detect updates.

  We need to update this list when a new author has been added or removed, which
  can be auto-detected this.props.node. However it should also
  updates if changes are made to the organisation entries in the entity db.
*/
export default class AffiliationsList extends NodeComponent {
  render ($$) {
    const api = this.context.api
    const article = api.getArticle()

    let el = $$('div').addClass('sc-affiliations-list')
    let entityIds = this._getOrgansiations()

    let contentEl = $$('div').addClass('se-content')
    entityIds.forEach((entityId, index) => {
      let entity = article.get(entityId)
      contentEl.append(
        $$('span').addClass('se-affiliation').html(
          renderEntity(entity)
        )
      )
      if (index < entityIds.length - 1) {
        contentEl.append('; ')
      }
    })
    el.append(contentEl)
    return el
  }

  _getAuthors () {
    return this.props.node.findAll('contrib').map(contrib => contrib.getAttribute('rid'))
  }

  _getOrgansiations () {
    const api = this.context.api
    const article = api.getArticle()

    let organisations = []
    let authors = this._getAuthors()
    authors.forEach(authorId => {
      let author = article.get(authorId)
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
