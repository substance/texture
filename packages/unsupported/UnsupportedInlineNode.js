import InlineNode from 'substance/model/InlineNode'

class UnsupportedInlineNode extends InlineNode {}

UnsupportedInlineNode.static.name = 'unsupported-inline';

UnsupportedInlineNode.static.defineSchema({
  xml: 'string',
  tagName: 'string'
})

export default UnsupportedInlineNode;
