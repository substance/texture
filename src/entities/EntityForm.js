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

    for (let property of schema) {
      let name = property.name
      let type = property.type
      let targetTypes = property.targetTypes
      let value = node[name]
      if (name === 'id') {
        // id property is not editable and skipped
      } else if (type === 'string') {
        let inputEl
        if (property.definition._isText) {
          inputEl = $$(RichTextInput, {
            value,
            editorId: name
          }).ref(name)
        } else {
          inputEl = $$(StringInput, { value }).ref(name)
        }
        el.append(
          $$(FormLabel, { name }),
          inputEl
        )
      } else if (isArray(type) && type[0] === 'array' && targetTypes[0] !== 'object') {
        el.append(
          $$(FormLabel, { name }),
          $$(RelationshipInput, {
            propertyName: name,
            entityIds: value || [],
            targetTypes
          }).ref(name)
        )
      } else if (isArray(type) && targetTypes[0] === 'object') {
        // HACK: we render a special Author Editor if the targetType is object
        el.append(
          $$(FormLabel, { name }),
          $$(PersonGroupInput, {
            entries: value
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
    let schema = this._getSchema()

    forEach(schema.properties, (property, propertyName) => {
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
