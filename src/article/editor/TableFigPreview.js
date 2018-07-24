import { Component } from 'substance'
import { getLabel } from '../shared/nodeHelpers'

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
    let label = getLabel(this.props.node)
    return $$('div').addClass('se-label').append(label)
  }
}
