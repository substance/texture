import { TextNode, STRING } from 'substance'

export default class Preformat extends TextNode {}
Preformat.schema = {
  type: 'preformat',
  content: STRING,
  preformatType: STRING
}
