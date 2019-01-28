import { Component } from 'substance'
import { InputWithButton } from '../../kit'

export default class QueryComponent extends Component {
  render ($$) {
    let Input = this.getComponent('input')

    const btnEl = $$('button').addClass('se-action')

    if (this.props.loading) {
      btnEl.append(
        this._renderIcon($$, 'input-loading')
      )
    } else if (this.props.errors) {
      btnEl.append(
        this._renderIcon($$, 'input-error')
      )
    } else {
      btnEl.append(
        this.getLabel(this.props.actionLabel)
      ).on('click', this._onQuery)
    }

    let el = $$('div').addClass('sc-query').append(
      $$(InputWithButton, {
        input: $$(Input).attr({
          type: 'text',
          placeholder: this.getLabel(this.props.placeholder)
        }).ref('input').on('input', this._unblockUI),
        button: btnEl
      })
    )

    if (this.props.errors) {
      el.addClass('sm-error').append(
        $$('div').addClass('se-error-popup').append(
          $$('ul').addClass('se-error-list')
            .append(this.props.errors.map(err => $$('li').append(err)))
        )
      )
    }

    return el
  }

  _renderIcon ($$, icon) {
    return $$('div').addClass('se-icon').append(
      this.context.iconProvider.renderIcon($$, icon)
    )
  }

  _onQuery () {
    const input = this.refs.input
    const val = input.val()
    if (val) this.send('query', val)
  }

  _unblockUI () {
    if (this.props.errors) {
      this.extendProps({errors: undefined})
    }
  }
}
