import DefaultModelComponent from '../shared/DefaultModelComponent'
import LanguageEditor from './LanguageEditor'

export default class TranslatableEntryEditor extends DefaultModelComponent {
  // using a special translatable property editor for entries with language picker
  _getPropertyEditorClass (name, value) {
    if (name === 'language') {
      return LanguageEditor
    } else {
      return super._getPropertyEditorClass(name, value)
    }
  }
}
