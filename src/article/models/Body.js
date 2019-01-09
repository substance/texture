import { ContainerMixin, DocumentNode } from 'substance'

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
  content: {
    type: ['array', 'id'],
    owned: true,
    default: [],
    targetTypes: ['block-formula', 'block-quote', 'figure', 'heading', 'list', 'paragraph', 'preformat', 'supplementary-file', 'table-figure'],
    defaultTextType: 'paragraph'
  }
}
