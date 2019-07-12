import { DocumentNode, STRING } from 'substance'

export default class UnsupportedNode extends DocumentNode {}
UnsupportedNode.schema = {
  type: 'unsupported-node',
  data: STRING
}
