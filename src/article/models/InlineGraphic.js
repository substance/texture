import { InlineNode, STRING } from 'substance'

export default class InlineGraphic extends InlineNode {}
InlineGraphic.schema = {
  type: 'inline-graphic',
  mimeType: STRING,
  href: STRING
}
