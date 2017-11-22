import { Component } from 'substance'
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
          .attr({type: 'search', value: this.state.searchString })
          .on('change', this._onSearchStringChanged)
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
    } else {
      el.append(
        this._renderNotFound($$)
      )
    }

    return el
  }

  _renderOptions($$) {
    let el = $$('div').addClass('se-options')
    let db = this.context.db

    this.state.results.forEach(entityId => {
      let entity = db.get(entityId)
      el.append(
        $$('div').addClass('se-option').append(
          entityRenderers[entity.type]($$, entity.id, db)
        )
      )
    })
    return el
  }

  _renderCreate($$) {
    let el = $$('div').addClass('se-create').append(
      'TODO: implenent create dialog'
    )
    return el
  }

  _renderNotFound($$) {
    let el = $$('div').addClass('se-not-found').append(
      'No entries found'
    )
    return el
  }

  // TODO: For the current prorotype we show everything, but we should
  // implement/sketch a full text search here
  _findEntities() {
    let db = this.context.db
    let availableEntities = []
    this.props.targetTypes.forEach(targetType => {
      availableEntities = availableEntities.concat(
        db.find({ type: targetType })
      )
    })
    return availableEntities
  }

  _onSearchStringChanged() {
    let searchString = this.refs.searchString.val()
    console.info('Searching for: ', searchString)
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
