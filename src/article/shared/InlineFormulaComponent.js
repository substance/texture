import { NodeComponent } from '../../kit'
import TexMathComponent from './TexMathComponent'

// TODO: introduce an InlineFormulaModel
export default class InlineFormulaComponent extends NodeComponent {
  render ($$) {
    const node = this.props.node
    const texMath = node.find('tex-math')
    const el = $$('span').addClass('sc-inline-formula')
    el.append(
      $$(TexMathComponent, {
        node: texMath
      }).ref('math')
    )
    if (this.props.isolatedNodeState) {
      el.addClass('sm-' + this.props.isolatedNodeState)
    }
    return el
  }
}
