import { DocumentNode, CONTAINER, TEXT } from 'substance'
import { RICH_TEXT_ANNOS } from './modelConstants'

export default class Acknowledgement extends DocumentNode {
  render (options = {}) {
    return this.title || ''
  }
}

Acknowledgement.schema = {
  type: 'acknowledgement',
  title: TEXT(RICH_TEXT_ANNOS),
  content: CONTAINER({
    nodeTypes: ['paragraph', 'heading'],
    defaultTextType: 'paragraph'
  }),
}
