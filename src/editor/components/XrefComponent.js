import { NodeComponent } from 'substance'
import { getXrefTargets, getXrefLabel } from '../util'

export default class XrefComponent extends NodeComponent {

  render($$) {
    let node = this.props.node
    let refType = node.getAttribute('ref-type')
    let el = $$('span').addClass('sc-xref')
    let label = getXrefLabel(node)
    el.append(label)
    el.addClass('sm-'+refType)
    return el
  }

}
