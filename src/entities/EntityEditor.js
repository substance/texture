import { Component, forEach, isArray } from 'substance'
import EntitySelector from './EntitySelector'

export default class CitationEditor extends Component {

  didMount() {
    this.handleActions({
      'cancel': this._closeDialog,
      'entitiesSelected': this._onEntitiesSelected
    })
  }

  getInitialState() {
    // We want to keep state in a plain old JS object while editing
    return {
      node: this.props.node.toJSON(),
      // Used when a dialog should be rendered on top of the current dialog
      dialogProps: null
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-entity-editor')
    let schema = this._getSchema()

    // We render a dialog on top of the existing one
    if (this.state.dialogProps) {
      el.append(
        $$(EntitySelector, this.state.dialogProps)
      )
    } else {
      forEach(schema, (property, propertyName) => {
        if (propertyName === 'id') {
          // id property is not editable and skipped
        } else if (property.type === 'string') {
          el.append(
            this._renderStringProperty(property.name, $$)
          )
        } else if (isArray(property.type) && property.type[0]) {
          el.append(
            this._renderEntityList(property.name, $$)
          )
        } else {
          console.warn('type ', property.type, 'not yet supported')
        }
      })
    }
    return el
  }

  _renderEntityList(propertyName, $$) {
    let el = $$('div').addClass('se-entity-list')
    let entities = this.state.node[propertyName]
    el.append(
      entities.join(', ')
    )

    el.append(
      $$('button').append('Edit').on('click', this._openEntitySelector.bind(this, propertyName))
    )
    return el
  }

  _openEntitySelector(propertyName) {
    this.extendState({
      dialogProps: {
        editorSession: this.props.editorSession,
        entityIds: this.state.node[propertyName],
        property: propertyName,
        targetTypes: ['person']
      }
    })
  }

  _closeDialog() {
    this.extendState({
      dialogProps: undefined
    })
  }

  _renderStringProperty(propertyName, $$) {
    return $$('div').append(
      $$('div').addClass('se-label').append(
        propertyName
      ),
      $$('input').attr({ type: 'text', value: this.state.node[propertyName] })
    )
  }

  _onEntitiesSelected(property, entityIds) {
    let node = Object.assign({}, this.state.node)
    node[property] = entityIds
    this.extendState({
      node,
      dialogProps: undefined
    })
  }

  _update() {
    console.warn('TODO: Save record in the database')
  }

  _getSchema() {
    let schema = this.props.editorSession.getDocument().schema
    return schema.getNodeSchema(this.props.node.type)
  }
}
