import { Component } from 'substance'

class TableComponent extends Component {

  render($$) {
    let el = $$('table')
      .addClass('sc-table')
      .attr('data-id', this.props.node.id)
      .html(this.props.node.htmlContent)

    return el
  }
}

export default TableComponent
