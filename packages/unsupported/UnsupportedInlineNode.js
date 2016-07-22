import InlineNode from 'substance/model/InlineNode'

class UnsupportedInlineNode extends InlineNode {}

UnsupportedInlineNode.type = 'unsupported-inline';

UnsupportedInlineNode.define({
  xml: 'string',
  tagName: 'string'
})

export default UnsupportedInlineNode;
