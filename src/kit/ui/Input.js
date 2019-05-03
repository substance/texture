import { Component, parseKeyCombo, parseKeyEvent } from 'substance'

const ESCAPE = parseKeyEvent(parseKeyCombo('Escape'))

export default class Input extends Component {
  render ($$) {
    let { path, type, placeholder } = this.props
    let val = this._getDocumentValue()

    let el = $$('input').attr({
      value: val,
      type,
      placeholder
    }).addClass('sc-input')
      .val(val)
      .on('keydown', this._onKeydown)
    if (path) {
      el.on('change', this._onChange)
    }
    return el
  }

  submit () {
    let editorSession = this.context.editorSession
    let path = this.props.path
    let newVal = this.el.val()
    let oldVal = this._getDocumentValue()
    if (newVal !== oldVal) {
      editorSession.transaction(function (tx) {
        tx.set(path, newVal)
      })
      return true
    }
  }

  focus () {
    this.el.getNativeElement().focus()
  }

  _onChange () {
    if (this.submit() && this.props.retainFocus) {
      // ATTENTION: running the editor flow will rerender the model selection
      // which takes away the focus from this input
      this.focus()
    }
  }

  _getDocumentValue () {
    if (this.props.val) {
      return this.props.val
    } else {
      let editorSession = this.context.editorSession
      let path = this.props.path
      return editorSession.getDocument().get(path)
    }
  }

  _onKeydown (event) {
    let combo = parseKeyEvent(event)
    switch (combo) {
      // ESCAPE reverts the current pending change
      case ESCAPE: {
        if (this.props.handleEscape !== false) {
          event.stopPropagation()
          event.preventDefault()
          this.el.val(this._getDocumentValue())
        }
        break
      }
      default:
        // nothing
    }
  }
}
