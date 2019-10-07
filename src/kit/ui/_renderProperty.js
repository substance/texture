import { $$, isNil } from 'substance'
import _renderNode from './_renderNode'
import _getSettings from './_getSettings'
import BooleanComponent from './BooleanComponent'
import StringComponent from './StringComponent'
import TextComponent from './TextComponent'
import CollectionComponent from './CollectionComponent'
import ManyRelationshipComponent from './ManyRelationshipComponent'
import SingleRelationshipComponent from './SingleRelationshipComponent'

export default function renderProperty (comp, document, path, props = {}) {
  const propSpec = document.getProperty(path)

  let valueSettings
  let settings = _getSettings(comp)
  if (settings) {
    valueSettings = settings.getSettingsForValue(path)
  }

  props = Object.assign({
    document,
    path,
    disabled: comp.props.disabled,
    placeholder: comp.props.placeholder
  }, valueSettings, props)

  switch (propSpec.reflectionType) {
    case 'string':
      return $$(StringComponent, props)
    case 'text':
      return $$(TextComponent, props)
    case 'integer':
    case 'number':
      throw new Error('NOT IMPLEMENTED YET')
    case 'many':
      return $$(ManyRelationshipComponent)
    case 'one':
      return $$(SingleRelationshipComponent)
    case 'boolean':
      return $$(BooleanComponent, props)
    case 'child':
      return _renderNode(comp, document.resolve(path), props)
    case 'children':
      return $$(CollectionComponent, props)
    case 'container':
      // Note: do not override user props or value settings
      if (isNil(props.container)) {
        props.container = true
      }
      return $$(CollectionComponent, props)
    default:
      throw new Error('Unsupported type')
  }
}
