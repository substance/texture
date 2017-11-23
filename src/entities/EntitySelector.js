import { Component, without } from 'substance'
import entityRenderers from './entityRenderers'

export default class EntitySelector extends Component {

  getInitialState() {
    return {
      searchString: '',
      results: []
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-entity-selector')

    el.append(
      $$('div').addClass('se-input-field').append(
        $$('input')
          .attr({
            type: 'text',
            value: this.state.searchString,
            placeholder: this.props.placeholder
          })
          .on('input', this._onSearchStringChanged)
          .ref('searchString')
      )
    )

    if (this.state.searchString !== '') {
      el.append(
        this._renderOptions($$)
      )
    }

    return el
  }

  _renderOptions($$) {
    let el = $$('div').addClass('se-options')
    let db = this.context.db

    this.state.results.forEach(entity => {
      // let entity = db.get(entityId)
      el.append(
        $$('div').addClass('se-option').html(
          entityRenderers[entity.type](entity.id, db)
        ).on('click', this._selectOption.bind(this, entity.id))
      )
    })

    // Render options for creation
    this.props.targetTypes.forEach(targetType => {
      el.append(
        $$('div').addClass('se-option').append(
          $$('button').append('Create '+targetType)
        )
        .on('click', this._triggerCreate.bind(this, targetType))
      )
    })
    return el
  }

  _selectOption(entityId) {
    this.props.onSelected(entityId)
  }

  _triggerCreate(targetType) {
    this.props.onCreate(targetType)
  }

  // TODO: For the current prorotype we use a naive regexp based filtering,
  // but we should allow full text search here
  _findEntities(searchString) {
    let db = this.context.db
    let availableEntities = []
    this.props.targetTypes.forEach(targetType => {
      availableEntities = availableEntities.concat(
        db.find({ type: targetType })
      )
    })
    availableEntities = without(availableEntities, ...this.props.excludes)
      .map(entityId => {
        return db.get(entityId)
      })
      .filter(entity => {
        let htmlString = entityRenderers[entity.type](entity.id, db)
        return htmlString.match(new RegExp(searchString, 'i'))
      })
    return availableEntities
  }

  _onSearchStringChanged() {
    let searchString = this.refs.searchString.val()
    let results = []
    if (searchString) {
      results = this._findEntities(searchString)
    }

    this.setState({
      searchString: searchString,
      results
    })
  }
}
