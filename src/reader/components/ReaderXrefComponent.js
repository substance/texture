import { NodeComponent } from 'substance'
import { getXrefLabel, getXrefTargets } from '../../editor/util/xrefHelpers'

export default class ReaderXrefComponent extends NodeComponent {

  render($$) {
    let node = this.props.node
    
    let refType = node.getAttribute('ref-type')
    let label = getXrefLabel(node)
    let el = $$('span').addClass('sc-xref sm-'+refType).append(label)

    // Add a preview if refType is bibr
    if (refType === 'bibr') {
      el.append(
        this._renderPreview($$)
      )
    }
    return el
  }

  /*
    Only for references
  */
  _renderPreview($$) {
    let xrefTargets = getXrefTargets(this.props.node)
  }
}
