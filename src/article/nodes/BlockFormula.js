import { DocumentNode, STRING } from 'substance'

export default class BlockFormula extends DocumentNode {
  static get refType () {
    return 'disp-formula'
  }
}

BlockFormula.schema = {
  type: 'block-formula',
  label: STRING,
  content: STRING
}
