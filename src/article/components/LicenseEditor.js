import DropdownEditor from '../shared/DropdownEditor'
import { LICENSES } from '../ArticleConstants'

export default class LicenseEditor extends DropdownEditor {
  _getLabel () {
    return this.getLabel('select-license')
  }

  _getValues () {
    return LICENSES
  }
}
