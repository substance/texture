import { Component } from 'substance'

/*
  Renders a keyboard-selectable figure target item
*/
export default class TableFigPreview extends Component {

  render($$) {
    let node = this.props.node
    let el = $$('div')
      .addClass('sc-table-fig-preview')
      .attr({'data-id': node.id})

    if (this.props.selected) {
      el.addClass('sm-selected')
    }
    el.append(this._renderLabel($$))
    return el
  }

  _renderLabel($$) {
    let labelGenerator = this.context.labelGenerator
    let pos = labelGenerator.getPosition('table', this.props.node.id)
    return $$('div').addClass('se-label').append(
      'Table ', pos
    )
  }
}
