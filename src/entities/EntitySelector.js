import { Component, without, DefaultDOMElement } from 'substance'
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

    if (this.state.results.length > 0) {
      el.append(
        this._renderOptions($$)
      )
    } else if (this.state.searchString !== '' && this.state.results.length === 0) {
      el.append(
        this._renderCreate($$)
      )
    } else if (this.state.searchString !== '') {
      el.append(
        this._renderNotFound($$)
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
        $$('div').addClass('se-option').append(
          entityRenderers[entity.type]($$, entity.id, db)
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

  _renderCreate($$) {
    let el = $$('div').addClass('se-create')
    // Render create buttons for each allowed target type

    return el
  }

  _triggerCreate(targetType) {
    this.props.onCreate(targetType)
  }

  _renderNotFound($$) {
    let el = $$('div').addClass('se-not-found').append(
      'No entries found'
    )
    return el
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
        // TODO: Change entity renderer interface to HTML to make this simpler
        let el = DefaultDOMElement.parseSnippet('<div>', 'html')
        el.append(
          entityRenderers[entity.type](el.createElement, entity.id, db)
        )
        let htmlString = el.innerHTML
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
