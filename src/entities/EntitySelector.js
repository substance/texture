import { Component, without } from 'substance'
import entityRenderers from './entityRenderers'

export default class EntitySelector extends Component {

  getInitialState() {
    return {
      searchString: '',
      results: [],
      selectedIndex: -1
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-entity-selector')

    let inputEl = $$('div').addClass('se-input-field').append(
      $$('input')
        .attr({
          type: 'text',
          value: this.state.searchString,
          placeholder: this.props.placeholder
        })
        .on('input', this._onSearchStringChanged)
        .on('keydown', this._onKeydown)
        .ref('searchString')
    )

    if (this.state.searchString !== '') {
      let createBtns = $$('div').addClass('se-create')
      el.append(
        inputEl.append(createBtns),
        this._renderOptions($$)
      )
    } else {
      el.append(inputEl)
    }

    return el
  }

  _renderOptions($$) {
    let el = $$('div').addClass('se-options').ref('options')
    let db = this.context.db
    this.state.results.forEach((item, index) => {
      let option
      if (item._create) {
        option = $$('div').addClass('se-option').append(
          `Create ${item._create}`
        )
      } else {
        option = $$('div').addClass('se-option').html(
          entityRenderers[item.type](item.id, db)
        )
      }
      option.on('click', this._confirmSelected.bind(this, index))
      if (this.state.selectedIndex === index) {
        option.addClass('se-selected')
      }
      el.append(option)
      index += 1
    })
    return el
  }

  _confirmSelected(index) {
    let item = this.state.results[index]
    if (item._create) {
      this.props.onCreate(item._create)
    } else {
      this.props.onSelected(item.id)
    }
  }

  _selectNext() {
    let selectedIndex = this.state.selectedIndex
    let results = this.state.results
    if (selectedIndex < results.length - 1) {
      selectedIndex += 1
    }
    this.extendState({
      selectedIndex: selectedIndex
    })
  }

  _selectPrevious() {
    let selectedIndex = this.state.selectedIndex
    if (selectedIndex >= 0) {
      selectedIndex -= 1
    }
    this.extendState({
      selectedIndex: selectedIndex
    })
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

    // Add creation entries to result
    this.props.targetTypes.forEach(targetType => {
      results.push({
        _create: targetType
      })
    })

    this.setState({
      selectedIndex: -1,
      searchString: searchString,
      results
    })
  }

  _onKeydown(e) {
    if (e.keyCode === 38) {
      e.preventDefault()
      this._selectPrevious()
    } else if (e.keyCode === 40) {
      e.preventDefault()
      this._selectNext()
    } else if (e.keyCode === 13 && this.state.selectedIndex >= 0) {
      this._confirmSelected(this.state.selectedIndex)
    }
  }
}
