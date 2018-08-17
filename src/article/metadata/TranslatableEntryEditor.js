import { NodeModelEditor } from '../../kit'
import LanguageEditor from './LanguageEditor'

export default class TranslatableEntryEditor extends NodeModelEditor {
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
