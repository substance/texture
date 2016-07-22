import BlockNode from 'substance/model/BlockNode'

class UnsupportedNode extends BlockNode {}

UnsupportedNode.type = 'unsupported';

UnsupportedNode.define({
  xml: 'string',
  tagName: 'string'
});

export default UnsupportedNode;
