import { NodeComponent } from 'substance'

export default class InlineMathComponent extends NodeComponent {

  render($$) {
    const node = this.props.node

    return $$('span').append(node.textContent)
  }
}
