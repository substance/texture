import NodeComponent from '../shared/NodeComponent'
import { getLabel } from '../shared/nodeHelpers'

/*
  Renders a keyboard-selectable figure target item
*/
export default class FigPreview extends NodeComponent {

  render($$) {
    let node = this.props.node
    let el = $$('div')
      .addClass('sc-fig-preview')
      .attr({'data-id': node.id})

    if (this.props.selected) {
      el.addClass('sm-selected')
    }

    el.append(
      this._renderThumbnail($$),
      this._renderLabel($$)
    )
    return el
  }

  /*
    Render thumbnail based on the contents of the figure
  */
  _renderThumbnail($$) {
    let node = this.props.node
    // TODO: Make this work with tables as well
    let contentNode = node.find('graphic')
    let el = $$('div').addClass('se-thumbnail')
    if (contentNode) {
      el.append(
        $$(this.getComponent(contentNode.type), {
          node: contentNode,
          disabled: this.props.disabled
        })
      )
    } else {
      el.append('No thumb')
    }
    return el
  }

  _renderLabel($$) {
    let label = getLabel(this.props.node)
    return $$('div').addClass('se-label').append(label)
  }
}
