import { Component } from 'substance'

export default class InputActionComponent extends Component {
  render ($$) {
    let Input = this.getComponent('input')

    const el = $$('div').addClass('sc-input-action').append(
      $$(Input).attr({
        type: 'text',
        placeholder: this.getLabel(this.props.placeholder)
      }).ref('input').on('input', this._unblockUI)
    )

    const btnEl = $$('button').addClass('se-action')

    if (this.props.loading) {
      btnEl.append(
        this._renderIcon($$, 'input-loading')
      )
      el.append(btnEl)
    } else if (this.props.errors) {
      const errorsList = $$('ul').addClass('se-error-list')
        .append(this.props.errors.map(err => $$('li').append(err)))

      btnEl.append(
        this._renderIcon($$, 'input-error')
      )
      el.addClass('sm-error').append(
        btnEl,
        $$('div').addClass('se-error-popup').append(errorsList)
      )
    } else {
      btnEl.append(
        this.getLabel(this.props.actionLabel)
      ).on('click', this._onSubmit)
      el.append(btnEl)
    }

    return el
  }

  _renderIcon ($$, icon) {
    return $$('div').addClass('se-icon').append(
      this.context.iconProvider.renderIcon($$, icon)
    )
  }

  _onSubmit () {
    const input = this.refs.input
    const val = input.val()
    if (val) this.send('inputSubmit', val)
  }

  _unblockUI () {
    if (this.props.errors) {
      this.extendProps({errors: undefined})
    }
  }
}
