import NodeComponent from '../shared/NodeComponent'
import { getXrefLabel } from '../shared/xrefHelpers'

export default class XrefComponent extends NodeComponent {

  render($$) {
    let node = this.props.node
    let refType = node.getAttribute('ref-type')
    let label = getXrefLabel(node)
    return $$('span').addClass('sc-xref sm-'+refType).append(label)
  }
}
