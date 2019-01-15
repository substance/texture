import { ContainerMixin, DocumentNode, CONTAINER } from 'substance'

export default class Body extends ContainerMixin(DocumentNode) {
  getContent () {
    return this.content
  }
  getContentPath () {
    return [this.id, 'content']
  }
}
Body.schema = {
  type: 'body',
  content: CONTAINER({
    nodeTypes: ['block-formula', 'block-quote', 'figure', 'heading', 'list', 'paragraph', 'preformat', 'supplementary-file', 'table-figure'],
    defaultTextType: 'paragraph'
  })
}
