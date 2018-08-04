import { NodeModel } from '../../shared/NodeModel'

export default class ArticleRecordModel extends NodeModel {
  get id () { return 'article-record' }
  get type () { return 'article-record' }

  getProperties () {
    let props = super.getProperties()
    return props.filter(p => {
      return p.name !== 'authors' && p.name !== 'editors'
    })
  }
}
