import { InlineNode, STRING } from 'substance'

export default class InlineFormula extends InlineNode {}
InlineFormula.schema = {
  type: 'inline-formula',
  content: STRING
}
