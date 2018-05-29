import entityRenderers from '../../entities/entityRenderers'
import DefaultModel from './DefaultModel'

/*
  A model for holding authors and editors information.
*/
export default class ContribsModel extends DefaultModel{
  constructor(node, context) {
    super(node, context)
  }

  getAuthors() {
    let authorsContribGroup = this._node.find('contrib-group[content-type=author]')
    let contribIds = authorsContribGroup.findAll('contrib').map(contrib => contrib.getAttribute('rid'))
    return contribIds.map(contribId => this.context.pubMetaDb.get(contribId))
  }

  /*
    Utility method to render a contrib object
  */
  renderContrib(contrib) {
    return entityRenderers[contrib.type](contrib.id, this.context.pubMetaDb)
  }
}

