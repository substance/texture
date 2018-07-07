import { Component, FontAwesomeIcon } from 'substance'

export default class FormMultiSelectComponent extends Component {
  getInitialState() {
    const selected = this.props.selectedOptions
    return {
      values: selected,
      dropdown: false
    }
  }

  render($$) {
    const selected = this.state.values
    const availableOptions = this.props.availableOptions
    const options = availableOptions.filter(i => selected.indexOf(i.id) === -1)

    const el = $$('div').addClass('sc-form-multi-select')
    selected.forEach(opt => {
      el.append(this.renderSelectedOption($$, opt))
    })

    if(this.state.dropdown) {
      el.append(this.renderDropdown($$, options))
    } else if (options.length > 0) {
      const label = this.props.selectorLabel
      el.append(
        $$('button').addClass('se-add-item')
          .append(
            $$(FontAwesomeIcon, { icon: 'fa-plus' }),
            label
          ).on('click', this._onAddItem)
      )
    }

    return el
  }

  renderSelectedOption($$, id) {
    const availableOptions = this.props.availableOptions
    const options = availableOptions.reduce((acc, opt) => {
      acc[opt.id] = opt.text
      return acc
    }, {})

    const optEl = $$('div').addClass('se-multi-select-item')
      .append(
        $$('div').addClass('se-name').append(options[id]),
        $$('div').addClass('se-remove').append(
          $$('button').append(
            $$(FontAwesomeIcon, { icon: 'fa-trash' })
          ).on('click', this._onRemoveItem.bind(this, id))
        )
      )

    return optEl
  }

  renderDropdown($$, options) {
    const selectEl = $$('select').addClass('se-select').ref('select')
    options.forEach(opt => {
      selectEl.append(
        $$('option').attr({value: opt.id}).append(opt.text)
      )
    })
    return $$('div').addClass('se-add-option').append(
      $$('div').addClass('se-dropdown').append(selectEl),
      $$('button').append(
        $$(FontAwesomeIcon, { icon: 'fa-plus' }),
        'Add'
      ).on('click', this._onDropdownSelect)
    )
  }

  _onDropdownSelect() {
    const select = this.refs.select
    const values = this.state.values
    const selected = select.val()
    const newSelection = values.concat([selected])
    this.extendState({
      values: newSelection,
      dropdown: false
    })
    this.send('updatedSelection', newSelection)
  }

  _onAddItem() {
    this.extendState({dropdown: true})
  }

  _onRemoveItem(id) {
    const values = this.state.values
    const filtered = values.filter(i => i !== id)
    this.extendState({values: filtered})
    this.send('updatedSelection', filtered)
  }
}
