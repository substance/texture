import { Component } from 'substance'

/**
  ModalDialog component

  @class
  @component

  @prop {String} width 'small', 'medium', 'large' and 'full'

  @example

  ```js
  var form = $$(ModalDialog, {
    width: 'medium',
    textAlign: 'center'
  });
  ```
*/
export default class ModalDialog extends Component {
  render ($$) {
    let el = $$('div').addClass('sc-modal-dialog')

    // TODO: don't think that this is good enough. Right the modal is closed by any unhandled click.
    // Need to be discussed.
    el.on('click', this._closeModal)
    el.on('keydown', this._onKeydown)

    if (this.props.width) {
      el.addClass('sm-width-' + this.props.width)
    }

    if (this.props.transparent) {
      el.addClass('sm-transparent-bg')
    }

    el.append(
      $$('div').addClass('se-body').append(
        this.props.children
      )
    )
    return el
  }

  _onKeydown (e) {
    e.stopPropagation()
  }

  _closeModal (e) {
    e.preventDefault()
    e.stopPropagation()
    let closeSurfaceClick = e.target.classList.contains('sc-modal-dialog')
    if (closeSurfaceClick) {
      this.send('closeModal')
    }
  }
}
