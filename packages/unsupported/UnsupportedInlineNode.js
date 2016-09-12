import { InlineNode } from 'substance'

function UnsupportedInlineNode() {
  UnsupportedInlineNode.super.apply(this, arguments);
}

InlineNode.extend(UnsupportedInlineNode);

UnsupportedInlineNode.type = 'unsupported-inline';

UnsupportedInlineNode.define({
  attributes: { type: 'object', default: {} },
  xmlContent: {type: 'string', default: ''},
  tagName: 'string'
});

export default UnsupportedInlineNode;
