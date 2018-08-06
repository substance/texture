import { Component, FontAwesomeIcon } from 'substance'
import OverlayMixin from './OverlayMixin'

export default class MultiSelectInput extends OverlayMixin(Component) {
  render ($$) {
    const selected = this.props.selected
    const isEmpty = selected.length === 0
    const selectedLabels = selected.map(item => item.toString())

    const el = $$('div').addClass('sc-multi-select-input')
    if (isEmpty) el.addClass('sm-empty')

    // TODO: How can this be generalized?
    let label = isEmpty ? this.getLabel('multi-select-default-value') : selectedLabels.join('; ')
    el.append(
      $$('div').addClass('se-label').text(label)
    )

    if (this._canShowOverlay()) {
      el.append(
        this.renderValues($$)
      )
    }
    el.on('click', this._toggleOverlay)

    return el
  }

  renderValues ($$) {
    const label = this.props.label
    const selected = this.props.selected
    const options = this.props.options
    const editorEl = $$('div').addClass('se-select-editor').append(
      $$('div').addClass('se-arrow'),
      $$('div').addClass('se-select-label')
        // FIXME: use label provider
        .append('Choose ' + label)
    )
    options.forEach(option => {
      const isSelected = selected.indexOf(option) > -1
      const icon = isSelected ? 'fa-check-square-o' : 'fa-square-o'
      editorEl.append(
        $$('div').addClass('se-select-item').append(
          // FIXME: use icon provider
          $$(FontAwesomeIcon, { icon: icon }).addClass('se-icon'),
          $$('div').addClass('se-item-label')
            // TODO: I would like to have this implementation more agnostic of a specific data structure
            .append(option.toString()).ref(option.id)
        ).on('click', this._toggleItem.bind(this, option))
      )
    })
    return editorEl
  }

  _toggleItem (option, event) {
    event.stopPropagation()
    this.send('toggleOption', option)
  }
}
