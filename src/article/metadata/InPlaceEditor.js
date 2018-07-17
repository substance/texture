import { Component, FontAwesomeIcon } from 'substance'

export default class InPlaceEditor extends Component {

  render($$) {
    const items = this.props.values

    let el = $$('div').addClass('sc-in-place-editor')

    items.forEach(item => {
      el.append(
        this._renderEditor($$, item)
      )
    })

    el.append(
      $$('button').addClass('se-add-value')
        .append(
          $$(FontAwesomeIcon, {icon: 'fa-plus'}).addClass('se-icon'),
          'Add contributor'
        )
        .on('click', this._addContrib)
    )

    return el
  }

  _renderEditor($$, item) {
    let el = $$('div').addClass('se-entity-item').ref(item.id)
  
    el.append(
      $$('input').addClass('se-input')
        .attr({value: item.givenNames, placeholder: 'Given names'})
        .on('change', this._updateContrib.bind(this, item.id, 'givenNames')),
      $$('input').addClass('se-input')
        .attr({value: item.name, placeholder: 'Last name'})
        .on('change', this._updateContrib.bind(this, item.id, 'name')),
      $$('button').addClass('se-remove-value')
        .append($$(FontAwesomeIcon, {icon: 'fa-trash'}))
        .on('click', this._removeContrib.bind(this, item.id))  
    )

    return el
  }

  _addContrib() {
    this.send('add-contrib', this.props.name)
  }

  _removeContrib(itemId) {
    this.send('remove-contrib', this.props.name, itemId)
  }

  _updateContrib(itemId, propName, e) {
    const value = e.currentTarget.value
    this.send('update-contrib', itemId, propName, value)
  }

  _getContrib(id) {
    const pubMetaDb = this.context.api.pubMetaDb
    return pubMetaDb.get(id)
  }
  
  _getValue() {
    const items = this.state.items
    return items.map(item => item.id)
  }
}