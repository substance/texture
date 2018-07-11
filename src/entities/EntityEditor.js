import { Component, FontAwesomeIcon } from 'substance'

export default class EntityEditor extends Component {
  constructor(...args) {
    super(...args)
    this.handleActions({
      'set-value': this._setValue,
      'add-contrib': this._addContrib,
      'update-contrib': this._updateContrib,
      'remove-contrib': this._removeContrib
    })
  }

  didMount() {
    this.props.model.onUpdate(this.rerender, this)
  }

  dispose() {
    this.props.model.off(this)
  }

  render($$) {
    const fullMode = this.state.fullMode
    let model = this.props.model
    let schema = model.getSchema()

    let el = $$('div').addClass('sc-entity-editor').append(
      $$('div').addClass('se-entity-header').html(
        this.context.api.renderEntity(model)
        
      )
    )

    for (let property of schema) {
      if(property.name === 'id') continue
      let PropertyEditorClass = this._getPropertyEditorClass(property)
      if (PropertyEditorClass) {
        el.append(
          $$(PropertyEditorClass, {
            model,
            property
          }).ref(property.name)
        )
      }
    }

    const controlEl = $$('div').addClass('se-control')
      .on('click', this._toggleMode)

    if(!fullMode) {
      controlEl.append(
        $$(FontAwesomeIcon, { icon: 'fa-chevron-down' }).addClass('se-icon'),
        this.getLabel('show-more-fields')
      )
    } else {
      controlEl.append(
        $$(FontAwesomeIcon, { icon: 'fa-chevron-up' }).addClass('se-icon'),
        this.getLabel('show-less-fields')
      )
    }

    el.append(controlEl)

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
    Toogle form, by default we are showing only filled and required filds
  */
  _toggleMode() {
    const fullMode = this.state.fullMode
    this.extendState({fullMode: !fullMode})
  }

  /*
    Used to populate MultiSelectInput fields
  */
  _getAvailableOptions (collection) {
    let items = this.context.api.getCollectionForType(collection)
    return items.map(item => {
      return {
        id: item.id,
        text: this._renderEntity(item)
      }
    })
  }

  _getPropertyEditorClass(property) {
    let propertyEditors = this.context.configurator.getPropertyEditors()
    let Editor = propertyEditors.find(Editor => {
      return Editor.matches(property)
    })
    return Editor
  }

  _addContrib(propName) {
    const model = this.props.model
    model.addContrib(propName)
  }

  _removeContrib(propName, contribId) {
    const model = this.props.model
    model.removeContrib(propName, contribId)
  }

  _updateContrib(contribId, propName, value) {
    const model = this.props.model
    model.updateContrib(contribId, propName, value)
    // TODO: find a better way of updating the entity header
    this.rerender()
  }

  _setValue(propName, value) {
    const model = this.props.model
    model.setValue(propName, value)
  }
}
