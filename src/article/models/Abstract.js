import { DocumentNode, CONTAINER } from 'substance'

export default class Abstract extends DocumentNode {
  getNodes () {
    const doc = this.getDocument()
    return this.content.map(id => doc.get(id)).filter(Boolean)
  }
}
Abstract.schema = {
  type: 'abstract',
  content: CONTAINER('paragraph')
}
