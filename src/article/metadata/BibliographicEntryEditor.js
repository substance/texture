import DefaultModelComponent from '../shared/DefaultModelComponent'
import InplaceRefContribsEditor from './InplaceRefContribsEditor'

export default class BibliographicEntryEditor extends DefaultModelComponent {
  // using a special inplace property editor for 'ref-contrib's
  _getPropertyEditorClass (name, value) {
    if (value.hasTargetType('ref-contrib')) {
      return InplaceRefContribsEditor
    } else {
      return super._getPropertyEditorClass(name, value)
    }
  }
}
