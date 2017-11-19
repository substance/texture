import { Component, forEach, isArray } from 'substance'
import EditRelationship from './EditRelationship'
import entityRenderers from './entityRenderers'
import FormLabel from './FormLabel'

export default class EditEntity extends Component {

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
    let el = $$('div').addClass('sc-edit-entity')
    let schema = this._getSchema()

    // We render a dialog on top of the existing one
    if (this.state.dialogProps) {
      el.append(
        $$(EditRelationship, this.state.dialogProps)
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

      el.append(
        $$('button').append('Save').on('click', this._save),
        $$('button').append('Cancel').on('click', this._cancel)
      )
    }
    return el
  }

  _renderEntityList(propertyName, $$) {
    let el = $$('div').addClass('se-entity-list')
    let entities = this.state.node[propertyName]
    let db = this._getDb()

    entities.forEach((entityId, index) => {
      let entity = db.get(entityId)
      el.append(
        entityRenderers[entity.type]($$, entity.id, db)
      )
      if (index < entities.length-1) {
        el.append(', ')
      }
    })
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

  _save() {
    let editorSession = this.props.editorSession
    editorSession.transaction((tx) => {
      tx.updateNode(this.props.node.id, this.state.node)
    })

    this.send('done')
  }

  _cancel() {
    this.send('closeModal')
  }

  _closeDialog() {
    this.extendState({
      dialogProps: undefined
    })
  }

  _renderStringProperty(propertyName, $$) {
    return $$('div').append(
      $$(FormLabel, {
        name: propertyName
      }),
      $$('input').attr({
        'data-property': propertyName,
        type: 'text', value: this.state.node[propertyName]
      })
        .on('change', this._onTextChanged)
    )
  }

  _onTextChanged(e) {
    let newVal = e.currentTarget.value
    let propertyName = e.currentTarget.dataset.property
    this.state.node[propertyName] = newVal
  }

  _onEntitiesSelected(property, entityIds) {
    let node = Object.assign({}, this.state.node)
    node[property] = entityIds
    this.extendState({
      node,
      dialogProps: undefined
    })
  }

  _getDb() {
    return this.props.editorSession.getDocument()
  }

  _getSchema() {
    let schema = this._getDb().schema
    return schema.getNodeSchema(this.props.node.type)
  }
}
