import BlockNode from 'substance/model/BlockNode'

class UnsupportedNode extends BlockNode {}

UnsupportedNode.static.name = 'unsupported';

UnsupportedNode.static.defineSchema({
  xml: 'string',
  tagName: 'string'
});

export default UnsupportedNode;
