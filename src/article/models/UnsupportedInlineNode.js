import { InlineNode } from 'substance'

export default class UnsupportedInlineNode extends InlineNode {}
UnsupportedInlineNode.schema = {
  type: 'unsupported-inline-node',
  data: 'string'
}
