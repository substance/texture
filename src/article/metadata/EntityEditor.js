import { Component, FontAwesomeIcon } from 'substance'

const REQUIRED_PROPERTIES = {
  'book': {
    'authors': true,
    'title': true
  },
  'chapter': {
    'title': true,
    'containerTitle': true,
    'authors': true,
  },
  'data-publication': {
    'title': true,
    'containerTitle': true,
    'authors': true,
  },
  'magazine-article': {
    'title': true,
    'containerTitle': true,
    'authors': true,
  },
  'newspaper-article': {
    'title': true,
    'containerTitle': true,
    'authors': true,
  },
  'patent': {
    'title': true,
    'containerTitle': true,
    'inventors': true,
  },
  'journal-article': {
    'title': true,
    'containerTitle': true,
    'authors': true,
  },
  'conference-paper': {
    'title': true,
    'authors': true
  },
  'report': {
    'title': true,
    'authors': true
  },
  'software': {
    'title': true,
    'authors': true
  },
  'thesis': {
    'title': true,
    'authors': true,
    'year': true
  },
  'webpage': {
    'title': true,
    'authors': true,
    'containerTitle': true
  },
  'person': {
    'surname': true,
    'givenNames': true
  },
  'ref-contrib': {
    'name': true,
    'givenNames': true
  },
  'group': {
    'name': true
  },
  'organisation': {
    'name': true
  },
  'award': {
    'institution': true
  },
  'keyword': {
    'name': true
  },
  'subject': {
    'name': true
  }

}



export default class EntityEditor extends Component {
  constructor(...args) {
    super(...args)
    this.handleActions({
      'set-value': this._setValue
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

    let propertyStates = this._computePropertyStates()

    propertyStates.forEach(propertyState => {
      
    })

    for (let property of schema) {
      const isOptional = property.isOptional()
      const isEmpty = model._node[property.name] ? String(model._node[property.name]).length === 0 : true
      if(property.name === 'id' || !fullMode && isEmpty && isOptional) continue
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

    el.append(
      $$('div').addClass('se-entity-footer').append(
        controlEl,
        $$('button').addClass('se-remove-item').append(
          $$(FontAwesomeIcon, { icon: 'fa-trash' }).addClass('se-icon'),
          'Remove'
        ).on('click', this._removeEntity)
      )
    )

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
    [
      {
        property: NodeProperty
        warning: true,
        hidden: false
      }
    ]
  */
  _computePropertyStates() {
    let model = this.props.model
    let schema = model.getSchema()
    let result = []

    for (let property of schema) {
      if (property.name === 'id') continue
      let warnings = this._getWarnings(property)
      let empty = this._isPropertyEmpty(property)
      let hidden = empty && warnings.length === 0

      result.push({
        property,
        warnings,
        hidden
      })
    }
    return result
  }

  _isPropertyEmpty(property) {
    let model = this.props.model
    return model._node[property.name] ? String(model._node[property.name]).length === 0 : true
  }

  _getWarnings(property, empty) {
    let model = this.props.model
    
    let isRequired = REQUIRED_PROPERTIES[model.type][property.name]
    if (isRequired && empty) {
      return [{ message: `${property.name} is required` }]
    } else {
      return []
    }
  }

  _getPropertyEditorClass(property) {
    let propertyEditors = this.context.configurator.getPropertyEditors()
    let Editor = propertyEditors.find(Editor => {
      return Editor.matches(property)
    })
    return Editor
  }

  _setValue(propName, value) {
    const model = this.props.model
    model.setValue(propName, value)
  }

  _removeEntity() {
    const model = this.props.model
    this.send('remove-item', model)
  }
}



