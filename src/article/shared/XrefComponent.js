import { EditableInlineNodeComponent } from '../../kit'
import { getXrefLabel } from './xrefHelpers'
import XrefEditor from './XrefEditor'

export default class XrefComponent extends EditableInlineNodeComponent {
  render ($$) {
    let node = this.props.node
    let refType = node.refType
    let label = getXrefLabel(node)
    let el = super.render($$)
      .addClass('sc-xref sm-' + refType)
    if (!label) {
      el.addClass('sm-no-label')
      el.append('?')
    } else {
      el.append(label)
    }
    return el
  }

  _getEditorClass () {
    return XrefEditor
  }
}
