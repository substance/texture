import entityRenderers from '../../entities/entityRenderers'
import DefaultModel from './DefaultModel'

/*
  A model for holding authors and editors information.
*/
export default class ContribsModel extends DefaultModel {
  constructor(node, context) {
    super(node, context)
  }

  addAuthor(author) {
    return this._addNode(author, 'person')
  }

  getAuthors() {
    let authorsContribGroup = this._node.find('contrib-group[content-type=author]')
    let contribIds = authorsContribGroup.findAll('contrib').map(contrib => contrib.getAttribute('rid'))
    return contribIds.map(contribId => this.context.pubMetaDb.get(contribId).toJSON())
  }

  updateAuthor(authorId, data) {
    return this._updateNode(authorId, data)
  }

  deleteAuthor(authorId) {
    return this._deleteNode(authorId)
  }

  addAffiliation(affiliation) {
    return this._addNode(affiliation, 'organisation')
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

  updateAffiliation(affId, data) {
    return this._updateNode(affId, data)
  }

  deleteAffiliation(affId) {
    return this._deleteNode(affId)
  }

  /*
    Utility method to render a contrib object
  */
  renderContrib(contrib) {
    return entityRenderers[contrib.type](contrib.id, this.context.pubMetaDb)
  }

  /*
    Internal method for adding a node of certain type
  */
  _addNode(data, type) {
    const newNode = Object.assign({}, data, {
      type: type
    })
    const pubMetaDbSession = this.context.pubMetaDbSession
    let node
    pubMetaDbSession.transaction((tx) => {
      node = tx.create(newNode)
    })
    return node.id
  }

  /*
    Internal method for updating a certain node
  */
  _updateNode(nodeId, data) {
    const pubMetaDbSession = this.context.pubMetaDbSession
    let node
    pubMetaDbSession.transaction((tx) => {
      node = tx.updateNode(nodeId, data)
    })
    return node.toJSON()
  }

  /*
    Internal method for removing a certain node
  */
  _deleteNode(nodeId) {
    const pubMetaDbSession = this.context.pubMetaDbSession
    let node
    pubMetaDbSession.transaction((tx) => {
      node = tx.delete(nodeId)
    })
    return node.id
  }
}
