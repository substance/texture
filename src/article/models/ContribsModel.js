import entityRenderers from '../../entities/entityRenderers'
import DefaultModel from './DefaultModel'

/*
  A model for holding authors and editors information.
*/
export default class ContribsModel extends DefaultModel{
  constructor(node, context) {
    super(node, context)
  }

  addAuthor(author) {
    const newNode = Object.assign({}, author, {
      type: 'person'
    })
    const pubMetaDbSession = this.context.pubMetaDbSession
    let node
    pubMetaDbSession.transaction((tx) => {
      node = tx.create(newNode)
    })
    return node.id
  }

  getAuthors() {
    let authorsContribGroup = this._node.find('contrib-group[content-type=author]')
    let contribIds = authorsContribGroup.findAll('contrib').map(contrib => contrib.getAttribute('rid'))
    return contribIds.map(contribId => this.context.pubMetaDb.get(contribId).toJSON())
  }

  updateAuthor(authorId, data) {
    const pubMetaDbSession = this.context.pubMetaDbSession
    let node
    pubMetaDbSession.transaction((tx) => {
      node = tx.updateNode(authorId, data)
    })
    return node.toJSON()
  }

  getAffiliations() {
    const authors = this.getAuthors()
    const affIds = authors.reduce((affs, author) => {
      const members = author.members || []
      const memberAffs = members.reduce((a,m) => {
        return a.concat(m.affiliations)
      }, [])
      let affsList = new Array().concat(author.affiliations, memberAffs)
      if(author.presentAffiliation) {
        affsList = affsList.concat(author.presentAffiliation)
      }
      affsList.forEach(a => {
        if(affs.indexOf(a) < 0) {
          affs.push(a)
        }
      })
      return affs
    }, [])
    return affIds.map(affId => this.context.pubMetaDb.get(affId).toJSON())
  }

  /*
    Utility method to render a contrib object
  */
  renderContrib(contrib) {
    return entityRenderers[contrib.type](contrib.id, this.context.pubMetaDb)
  }
}
