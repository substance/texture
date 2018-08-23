import NodeModelComponent from '../shared/NodeModelComponent'
import InplaceRefContribEditor from './InplaceRefContribEditor'

export default class BibliographicEntryEditor extends NodeModelComponent {
  // using a special inplace property editor for 'ref-contrib's
  _getPropertyEditorClass (property) {
    let targetTypes = property.targetTypes
    if (targetTypes[0] === 'ref-contrib') {
      return InplaceRefContribEditor
    } else {
      return super._getPropertyEditorClass(property)
    }
  }
}
