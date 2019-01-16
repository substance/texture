import Input from './Input'

export default class TextArea extends Input {
  render ($$) {
    const { path, rows, cols, wrap, placeholder } = this.props
    let value = this._getDocumentValue()
    let el = $$('textarea').attr({
      value,
      placeholder,
      rows,
      cols,
      wrap
    }).addClass('sc-text-area')
      .val(value)
      .on('keydown', this._onKeydown)
    if (path) {
      el.on('change', this._onChange)
    }
    return el
  }
}
