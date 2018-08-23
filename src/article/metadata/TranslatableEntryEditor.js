import NodeModelComponent from '../shared/NodeModelComponent'
import LanguageEditor from './LanguageEditor'

export default class TranslatableEntryEditor extends NodeModelComponent {
  // using a special translatable property editor for entries with language picker
  _getPropertyEditorClass (property) {
    let propertyName = property.name
    if (propertyName === 'language') {
      return LanguageEditor
    } else {
      return super._getPropertyEditorClass(property)
    }
  }
}
