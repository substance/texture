import { DefaultNodeComponent } from '../components'
import AbstractTypeEditor from './AbstractTypeEditor'
import mapWithChangedOrder from '../shared/mapWithChangedOrder'

export default class CustomAbstractComponent extends DefaultNodeComponent {
  _getClassNames () {
    return `sc-custom-abstract`
  }
  // using a special property editor for abstract type dropdown editor
  _getPropertyEditorClass (name, value) {
    if (name === 'abstractType') {
      // TODO: we should introduce EnumComponent for enum types
      return AbstractTypeEditor
    } else {
      return super._getPropertyEditorClass(name, value)
    }
  }

  /**
   * ATTENTION: overriding to change the order of properties.
   */
  _createPropertyModels () {
    return mapWithChangedOrder(super._createPropertyModels(), ['abstractType', 'title', 'content'])
  }
}
