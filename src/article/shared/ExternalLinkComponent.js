import { EditableAnnotationComponent } from '../../kit'
import ExternalLinkEditor from './ExternalLinkEditor'

export default class ExtLinkComponent extends EditableAnnotationComponent {
  render ($$) {
    let node = this.props.node
    return super.render($$).attr('href', node.href)
  }

  getTagName () {
    return 'a'
  }

  _getEditorClass () {
    return ExternalLinkEditor
  }
}
