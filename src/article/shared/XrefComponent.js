import { NodeComponent } from '../../kit'
import { getXrefLabel } from './xrefHelpers'

export default class XrefComponent extends NodeComponent {
  render ($$) {
    let node = this.props.node
    let refType = node.refType
    let label = getXrefLabel(node)
    let el = $$('span').addClass('sc-xref sm-' + refType)
    if (!label) {
      el.addClass('sm-no-label')
      el.append('?')
    } else {
      el.append(label)
    }
    return el
  }
}
