import { Component, isArray } from 'substance'
import TextInput from './TextInput'
import MultiSelectInput from './MultiselectInput'
import entityRenderers from './entityRenderers'

export default class EntityEditor extends Component {

  render($$) {
    let el = $$('div').addClass('sc-entity-editor')
    // TODO: make a state property out of this to switch between full mode and small form
    let fullMode = false
    // FIXME: in some cases this is not a node. Use a different name.
    let model = this.props.model
    let schema = this.props.schema

    for (let property of schema) {
      let name = property.name
      let type = property.type
      let targetTypes = property.targetTypes
      let isOptional = property.isOptional()
      let value = model[name]
      if(!fullMode && value === '' && isOptional) continue 
      if (name === 'id') {
        // id property is not editable and skipped
      } else if (type === 'string') {
        el.append(
          $$(TextInput, {
            id: name,
            label: this.getLabel(name),
            type: 'text',
            value: value,
            placeholder: 'Enter text',
            size: 'large'
          }).ref(name)
        )
      } else if (isArray(type) && type[0] === 'array' && targetTypes[0] !== 'object') {
        // TODO: How can we handle multiple target types (not just one collection) here?
        let targetType = targetTypes[0]
        el.append(
          $$(MultiSelectInput, {
            selectedOptions: value,
            availableOptions: this._getAvailableOptions(targetType),
            label: this.getLabel(name)
          }).ref(name)
        )
      } else {
        console.warn(`type ${type} not yet supported`)
      }
    }
    return el
  }

  /*
    Return complete form data
  */
  getData() {
    let result = {}
    let schema = this._getNodeSchema()
    for (let property of schema) {
      const name = property.name
      let input = this.refs[name]
      if (input) {
        result[name] = input.getValue()
      }
    }
    return result
  }

  /*
    Used to populate MultiSelectInput fields
  */
  _getAvailableOptions(collection) {
    let items = this.context.api.getCollectionForType(collection)
    return items.map(item => {
      return {
        id: item.id,
        text: this._renderEntity(item)
      }
    })
  }

  /*
    Utility method to render an entity
  */
  _renderEntity(entity) {
    // TODO: we should use pubMetaDb directly when it'll be available
    return entityRenderers[entity.type](entity.id, this.context.pubMetaDbSession.getDocument())
  }
}