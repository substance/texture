import { Component } from 'substance'

/*
  Renders a keyboard-selectable figure target item
*/
export default class FigPreview extends Component {

  render($$) {
    let node = this.props.node
    let el = $$('div')
      .addClass('sc-fig-preview')
      .attr({'data-id': node.id})

    if (this.props.selected) {
      el.addClass('sm-selected')
    }
    el.append(this._renderThumbnail($$))
    el.append(this._renderLabel($$))
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
    let labelGenerator = this.context.labelGenerator
    let label = labelGenerator.getPosition('fig', this.props.node.id)
    return $$('div').addClass('se-label').append(
      'Figure ', label
    )
  }
}
