import DefaultNodeComponent from '../shared/DefaultNodeComponent'
import LanguageEditor from './LanguageEditor'

export default class TranslatableEntryEditor extends DefaultNodeComponent {
  // using a special translatable property editor for entries with language picker
  _getPropertyEditorClass (name, value) {
    if (name === 'language') {
      return LanguageEditor
    } else {
      return super._getPropertyEditorClass(name, value)
    }
  }
}
