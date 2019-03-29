import { DocumentNode, CONTAINER } from 'substance'

export default class Abstract extends DocumentNode {}

Abstract.schema = {
  type: 'abstract',
  content: CONTAINER({
    nodeTypes: ['paragraph', 'heading'],
    defaultTextType: 'paragraph'
  })
}
