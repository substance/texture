import { NodeComponent } from 'substance'

export default class InlineFormulaComponent extends NodeComponent {

  render($$) {
    const node = this.props.node
    // TODO: Find out why node.find('tex-math') returns null here
    const texMath = node.findChild('tex-math').textContent
    // TODO: Use KaTeX
    return $$('span').append(texMath)
  }
}
