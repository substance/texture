import { TextNode, TEXT } from 'substance'

export default class Heading extends TextNode {}
Heading.schema = {
  type: 'heading',
  level: { type: 'number', default: 1 },
  content: TEXT()
}
