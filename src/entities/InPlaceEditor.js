import { Component, FontAwesomeIcon } from 'substance'

export default class InPlaceEditor extends Component {

  render($$) {
    const items = this.props.values
    const label = this.props.label

    let el = $$('div').addClass('sc-in-place-editor')

    if(label) {
      el.append(
        $$('label').append(label)
      )
    }

    let inputEl = $$('div').addClass('se-entity-input')

    items.forEach(item => {
      inputEl.append(
        this._renderEditor($$, item)
      )
    })

    inputEl.append(
      $$('button').addClass('se-add-value')
        .append(
          $$(FontAwesomeIcon, {icon: 'fa-plus'}).addClass('se-icon'),
          'Add new reference'
        )
        .on('click', this._addNewReference)
    )

    el.append(inputEl)

    return el
  }

  _renderEditor($$, item) {
    let el = $$('div').addClass('se-entity-item').ref(item.id)
  
    el.append(
      $$('input').addClass('se-input')
        .attr({value: item.givenNames, placeholder: 'Given names'}),
      $$('input').addClass('se-input')
        .attr({value: item.name, placeholder: 'Last name'}),
      $$('button').addClass('se-remove-value')
        .append($$(FontAwesomeIcon, {icon: 'fa-trash'}))
        .on('click', this._removeReference.bind(this, item.id))  
    )

    return el
  }

  _addNewReference() {
    this.send('add-contrib', this.props.name)
  }

  _removeReference(itemId) {
    this.send('remove-contrib', this.props.name, itemId)
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