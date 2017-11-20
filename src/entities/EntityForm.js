import { Component, forEach, isArray } from 'substance'

import FormLabel from './FormLabel'
import RelationshipInput from './RelationshipInput'
import StringInput from './StringInput'

export default class EntityForm extends Component {

  render($$) {
    let el = $$('div').addClass('sc-entity-form')
    let schema = this._getSchema()
    let node = this.props.node

    forEach(schema, (property, propertyName) => {
      if (propertyName === 'id') {
        // id property is not editable and skipped
      } else if (property.type === 'string') {
        el.append(
          $$(FormLabel, {
            name: propertyName
          }),
          $$(StringInput, {
            value: this.props.node[propertyName]
          }).ref(property.name)
        )
      } else if (isArray(property.type) && property.type[0] === 'array') {
        el.append(
          $$(FormLabel, {
            name: propertyName
          }),
          $$(RelationshipInput, {
            entityIds: node[propertyName],
            targetTypes: property.definition.targetTypes,
          }).ref(property.name)
        )
      } else {
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
    forEach(this.props.node, (property, propertyName) => {
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
    let schema = this.context.db.schema
    return schema.getNodeSchema(this.props.node.type)
  }
}
