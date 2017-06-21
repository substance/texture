import { NodeComponent } from 'substance'

export default class TableComponent extends NodeComponent {

  render($$) {
    let node = this.props.node
    let el = $$('div').addClass('sc-table')
    el.html(
      node.getInnerXML()
    )
    return el
  }
}
