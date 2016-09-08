import { BlockNode } from 'substance'

function UnsupportedNode() {
  UnsupportedNode.super.apply(this, arguments);
}

BlockNode.extend(UnsupportedNode);

UnsupportedNode.type = 'unsupported';

UnsupportedNode.define({
  attributes: { type: 'object', default: {} },
  xmlContent: {type: 'string', default: ''},
  tagName: 'string'
});

export default UnsupportedNode;
