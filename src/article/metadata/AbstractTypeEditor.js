import DropdownEditor from '../shared/DropdownEditor'
import { ABSTRACT_TYPES } from '../ArticleConstants'

export default class AbstractTypeEditor extends DropdownEditor {
  _getLabel () {
    return this.getLabel('select-abstract-type')
  }

  _getValues () {
    return ABSTRACT_TYPES
  }
}
