import { Component, FontAwesomeIcon, isArray } from 'substance'
import TextInput from './TextInput'
import MultiSelectInput from './MultiSelectInput'
import SelectInput from './SelectInput'
import InPlaceEditor from './InPlaceEditor'
import entityRenderers from './entityRenderers'


// authors: { type: ['ref-contrib'], default: [], optional: true },
// editors: { type: ['ref-contrib'], default: [], optional: true },

const EDITOR_TYPES = {
  'journal-article': {
    'authors': 'in-place-editor',
    'editors': 'in-place-editor',
    'translators': 'in-place-editor',
  }
}


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
    // FIXME: in some cases this is not a node. Use a different name.
    let model = this.props.model
    let data = model.toJSON()
    let schema = model.getSchema()
    let pubMetaDb = this.context.api.pubMetaDb

    let el = $$('div').addClass('sc-entity-editor').append(
      $$('div').addClass('se-entity-header').html(
        this._renderEntity(model)
      )
    )

    for (let property of schema) {
      let name = property.name
      let type = property.type
      let targetTypes = property.targetTypes
      let isOptional = property.isOptional()
      
      let value = data[name]
      if(!fullMode && value === '' && isOptional) continue

      let customEditor = _getCustomEditor(model.type, property)

      if (name === 'id') {
        // id property is not editable and skipped
      } else if (customEditor) {
        let values = value.map(collabId => pubMetaDb.get(collabId))
        el.append(
          $$(InPlaceEditor, {
            id: model.id,
            label: this.getLabel(name),
            name: name,
            values: values
          }).ref(name)
        )
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
        // let targetType = targetTypes[0]
        // el.append(
        //   $$(MultiSelectInput, {
        //     selectedOptions: value,
        //     availableOptions: this._getAvailableOptions(targetType),
        //     label: this.getLabel(name)
        //   }).ref(name)
        // )
      } else if (this._isSingleReference(property)) {
        let targetType = property.type
        el.append(
          $$(SelectInput, {
            id: name,
            value: value,
            availableOptions: this._getAvailableOptions(targetType),
            label: this.getLabel(name)
          }).ref(name)
        )
      } else {
        console.warn(`type ${type} not yet supported`)
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

  /*
    Utility method to render an entity
  */
  _renderEntity(entity) {
    // TODO: we should use pubMetaDb directly when it'll be available
    return entityRenderers[entity.type](entity.id, this.context.api.pubMetaDb)
  }

  /*
    Check if property is single reference to other entity
  */
  _isSingleReference(property) {
    const types = ['string','boolean','number','array','id','object']
    if(!isArray(property.type) && types.indexOf(property.type) === -1) return true
    return false
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
  }

  _setValue(propName, value) {
    const model = this.props.model
    model.setValue(propName, value)
  }
}

function _getCustomEditor(nodeType, property) {
  if (!EDITOR_TYPES[nodeType]) {
    return undefined
  }
  return EDITOR_TYPES[nodeType][property.name]
}