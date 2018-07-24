import NodeComponent from '../shared/NodeComponent'
import { getLabel } from '../shared/nodeHelpers'

export default class FnPreview extends NodeComponent {

  render($$) {
    const node = this.props.node
    const TextNode = this.getComponent('text-node')

    let el = $$('div')
      .addClass('sc-fn-preview')
      .attr({'data-id': this.props.node.id})

    if (this.props.selected) {
      el.addClass('sm-selected')
    }

    let label = getLabel(node) || ''
    el.append(
      $$('div').addClass('se-label').append(label)
    )

    // only showing the first paragraph
    let firstP = node.find('p')
    if (firstP) {
      el.append(
        $$(TextNode, { node: firstP })
      )
    }

    return el
  }
}

