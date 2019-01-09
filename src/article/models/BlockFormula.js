import { DocumentNode, STRING } from 'substance'

export default class BlockFormula extends DocumentNode {}

BlockFormula.schema = {
  type: 'block-formula',
  label: STRING,
  content: STRING
}
