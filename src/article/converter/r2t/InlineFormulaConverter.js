import BlockFormulaConverter from './BlockFormulaConverter'

export default class InlineFormulaConverter extends BlockFormulaConverter {
  get type () { return 'inline-formula' }

  get tagName () { return 'inline-formula' }
}
