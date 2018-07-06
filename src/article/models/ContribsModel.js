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
    const editorSession = this.context.editorSession
    const authorId = this._addEntity(author, 'person')
    editorSession.transaction((tx, args) => {
      const contribEl = tx.createElement('contrib').attr('rid', authorId)
      const authorsContribGroup = tx.find('contrib-group[content-type=author]')
      authorsContribGroup.append(contribEl)
      return args
    })
    return authorId
  }

  getAuthor(authorId) {
    return this._getEntity(authorId)
  }

  getAuthors() {
    let authorsContribGroup = this._node.find('contrib-group[content-type=author]')
    let contribIds = authorsContribGroup.findAll('contrib').map(contrib => contrib.getAttribute('rid'))
    return contribIds.map(contribId => this.context.pubMetaDb.get(contribId).toJSON())
  }

  updateAuthor(authorId, data) {
    return this._updateEntity(authorId, data)
  }

  deleteAuthor(authorId) {
    const editorSession = this.context.editorSession
    const node = this._deleteEntity(authorId)
    editorSession.transaction((tx, args) => {
      const authorsContribGroup = this._node.find('contrib-group[content-type=author]')
      const contrib = authorsContribGroup.find(`contrib[rid=${authorId}]`)
      contrib.parentNode.removeChild(contrib)
      tx.delete(contrib.id)
      return args
    })
    return node
  }

  addAffiliation(affiliation) {
    const editorSession = this.context.editorSession
    const affId = this._addEntity(affiliation, 'organisation')
    editorSession.transaction((tx, args) => {
      const affEl = tx.createElement('aff').attr('rid', affId)
      const affGroup = tx.find('aff-group')
      affGroup.append(affEl)
      return args
    })
    return affId
  }

  getAffiliation(affId) {
    return this._getEntity(affId)
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
    return this._updateEntity(affId, data)
  }

  deleteAffiliation(affId) {
    const editorSession = this.context.editorSession
    const node = this._deleteEntity(affId)
    editorSession.transaction((tx, args) => {
      const affGroup = tx.find('aff-group')
      const affEl = affGroup.find(`aff[rid=${affId}]`)
      affEl.parentNode.removeChild(affEl)
      tx.delete(affEl.id)
      return args
    })
    return node
  }

  addAward(award) {
    const editorSession = this.context.editorSession
    const awardId = this._addEntity(award, 'award')
    editorSession.transaction((tx, args) => {
      const awardGroupEl = tx.createElement('award-group').attr('rid', awardId)
      const fundingGroupEl = tx.find('funding-group')
      fundingGroupEl.append(awardGroupEl)
      return args
    })
    return awardId
  }

  getAward(awardId) {
    return this._getEntity(awardId)
  }

  getAwards() {
    const authors = this.getAuthors()
    const awardIds = authors.reduce((awards, author) => {
      const members = author.members || []
      const memberAwards = members.reduce((a,m) => {
        return a.concat(m.awards)
      }, [])
      let awardsList = new Array().concat(author.awards, memberAwards)
      awardsList.forEach(a => {
        if(awards.indexOf(a) < 0) {
          awards.push(a)
        }
      })
      return awards
    }, [])
    return awardIds.map(awardId => this.context.pubMetaDb.get(awardId).toJSON())
  }

  updateAward(awardId, data) {
    return this._updateEntity(awardId, data)
  }

  deleteAward(awardId) {
    const editorSession = this.context.editorSession
    const node = this._deleteEntity(awardId)
    editorSession.transaction((tx, args) => {
      const fundingGroup = tx.find('funding-group')
      const awardGroupEl = fundingGroup.find(`award-group[rid=${awardId}]`)
      awardGroupEl.parentNode.removeChild(awardGroupEl)
      tx.delete(awardGroupEl.id)
      return args
    })
    return node
  }

  /*
    Utility method to render a contrib object
  */
  renderContrib(contrib) {
    return entityRenderers[contrib.type](contrib.id, this.context.pubMetaDb)
  }

  /*
    Internal method for adding an entity of certain type
  */
  _addEntity(data, type) {
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
    Internal method for adding an entity of certain type
  */
  _getEntity(nodeId) {
    const pubMetaDb = this.context.pubMetaDb
    return pubMetaDb.get(nodeId).toJSON()
  }

  /*
    Internal method for updating a certain entity
  */
  _updateEntity(nodeId, data) {
    const pubMetaDbSession = this.context.pubMetaDbSession
    pubMetaDbSession.transaction((tx) => {
      tx.updateNode(nodeId, data)
    })
    return this._getEntity(nodeId)
  }

  /*
    Internal method for removing a certain entity
  */
  _deleteEntity(nodeId) {
    const pubMetaDbSession = this.context.pubMetaDbSession
    let node
    pubMetaDbSession.transaction((tx) => {
      node = tx.delete(nodeId)
    })
    return node
  }
}
