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
      this.props.targetTypes.forEach(targetType => {
        createBtns.append(
          $$('button').append('Create '+targetType)
            .on('click', this._triggerCreate.bind(this, targetType))
        )
      })
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
    let el = $$('div').addClass('se-options')
    let db = this.context.db

    this.state.results.forEach(entity => {
      // let entity = db.get(entityId)

      let option = $$('div').addClass('se-option').html(
        entityRenderers[entity.type](entity.id, db)
      ).on('click', this._selectOption.bind(this, entity.id))

      if(this.state.selected === entity.id) {
        option.addClass('se-selected')
      }

      el.append(option)
    })

    // // Render options for creation
    // this.props.targetTypes.forEach(targetType => {
    //   el.append(
    //     $$('div').addClass('se-option').append(
    //       $$('button').append('Create '+targetType)
    //     )
    //     .on('click', this._triggerCreate.bind(this, targetType))
    //   )
    // })
    return el
  }

  _selectOption(entityId) {
    this.props.onSelected(entityId)
  }

  _selectNext() {
    const selection = this.state.selected
    const results = this.state.results
    if(results.length > 0) {
      let selectedEntity
      if(selection) {
        const selectionIndex = results.findIndex(item => {
          return item.id === selection
        })

        if(selectionIndex < results.length - 1) {
          selectedEntity = results[selectionIndex + 1]
        } else {
          selectedEntity = results[0]
        }
      } else {
        selectedEntity = results[0]
      }

      this.extendState({selected: selectedEntity.id})
    }
  }

  _selectPrevious() {
    const selection = this.state.selected
    const results = this.state.results
    if(results.length > 0) {
      let selectedEntity
      if(selection) {
        const selectionIndex = results.findIndex(item => {
          return item.id === selection
        })

        if(selectionIndex > 0) {
          selectedEntity = results[selectionIndex - 1]
        } else {
          selectedEntity = results[results.length - 1]
        }
      } else {
        selectedEntity = results[results.length - 1]
      }

      this.extendState({selected: selectedEntity.id})
    }
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

  _onKeydown(e) {
    if (e.keyCode === 38) {
      e.preventDefault()
      this._selectPrevious()
    } else if (e.keyCode === 40) {
      e.preventDefault()
      this._selectNext()
    } else if (e.keyCode === 13 && this.state.selected) {
      this._selectOption(this.state.selected)
    }
  }
}
