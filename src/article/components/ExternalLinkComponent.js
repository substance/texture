import { EditableAnnotationComponent } from '../../kit'
import ExternalLinkEditor from './ExternalLinkEditor'

export default class ExternalLinkComponent extends EditableAnnotationComponent {
  render () {
    let node = this.props.node
    return super.render().attr('href', node.href).addClass('sc-external-link')
  }

  getTagName () {
    return 'a'
  }

  _getEditorClass () {
    return ExternalLinkEditor
  }
}
