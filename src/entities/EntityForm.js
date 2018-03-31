import { Component, forEach, isArray } from 'substance'

import FormLabel from './FormLabel'
import RelationshipInput from './RelationshipInput'
import StringInput from './StringInput'
import RichTextInput from '../rich-text-input/RichTextInput'
import PersonGroupInput from './PersonGroupInput'

export default class EntityForm extends Component {

  render($$) {
    let el = $$('div').addClass('sc-entity-form')
    let schema = this._getSchema()
    let node = this.props.node

    forEach(schema, (property, propertyName) => {
      if (propertyName === 'id') {
        // id property is not editable and skipped
      } else if (property.type === 'string') {
        let inputEl
        if (property.definition._isText) {
          inputEl = $$(RichTextInput, {
            value: this.props.node[propertyName],
            editorId: property.name
          }).ref(property.name)
        } else {
          inputEl = $$(StringInput, {
            value: this.props.node[propertyName]
          }).ref(property.name)
        }
        el.append(
          $$(FormLabel, {
            name: propertyName
          }),
          inputEl
        )
      } else if (isArray(property.type) && property.type[0] === 'array' && property.definition.targetTypes[0] !== 'object') {
        el.append(
          $$(FormLabel, {
            name: propertyName
          }),
          $$(RelationshipInput, {
            propertyName,
            entityIds: node[propertyName] || [],
            targetTypes: property.definition.targetTypes,
          }).ref(property.name)
        )
      } else if (isArray(property.type) && property.definition.targetTypes[0] === 'object') {
        // HACK: we render a special Author Editor if the targetType is object
        el.append(
          $$(FormLabel, {
            name: propertyName
          }),
          $$(PersonGroupInput, {
            entries: this.props.node[propertyName]
          }).ref(property.name)
        )
      }

      else {
        console.warn('type ', property.type, 'not yet supported')
      }
    })
    return el
  }

  /*
    Return complete form data
  */
  getData() {
    let result = {}
    let schema = this._getSchema()

    forEach(schema, (property, propertyName) => {
      let input = this.refs[propertyName]
      if (input) {
        result[propertyName] = input.getValue()
      }
    })
    return result
  }

  _closeDialog() {
    this.extendState({
      dialogProps: undefined
    })
  }

  _getSchema() {
    let schema = this.context.pubMetaDbSession.getDocument().schema
    return schema.getNodeSchema(this.props.node.type)
  }
}
