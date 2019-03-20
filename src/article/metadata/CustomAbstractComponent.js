import DefaultNodeComponent from '../shared/DefaultNodeComponent'
import AbstractTypeEditor from './AbstractTypeEditor'

export default class CustomAbstractComponent extends DefaultNodeComponent {
  _getClassNames () {
    return `sc-custom-abstract`
  }
  // using a special property editor for abstract type dropdown editor
  _getPropertyEditorClass (name, value) {
    if (name === 'abstractType') {
      return AbstractTypeEditor
    } else {
      return super._getPropertyEditorClass(name, value)
    }
  }
}
