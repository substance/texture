import { $$ } from 'substance'
import Surface from './_Surface'

export default class TextInput extends Surface {
  render () {
    const { placeholder, path, spellcheck, disabled } = this.props
    const TextPropertyComponent = this.getComponent('text-property')
    const isEditable = this.isEditable()
    // TODO: we should refactor Substance.TextPropertyEditor so that it can be used more easily
    const el = Surface.prototype.render.call(this, $$)
    el.addClass('sc-text-input')
    // Attention: being disabled does not necessarily mean not-editable, whereas non-editable is always disabled
    // A Surface can also be disabled because it is blurred, for instance.
    if (isEditable) {
      el.addClass('sm-editable')
      if (!disabled) {
        el.addClass('sm-enabled')
        el.attr('contenteditable', true)
        // native spellcheck
        el.attr('spellcheck', spellcheck === 'native')
      }
    } else {
      el.addClass('sm-readonly')
    }
    const content = $$(TextPropertyComponent, {
      doc: this.getDocument(),
      tagName: 'div',
      placeholder,
      path
    }).addClass('se-input')
    el.append(content)
    return el
  }

  // this is needed e.g. by SelectAllCommand
  get _isTextPropertyEditor () {
    return true
  }

  // this is needed e.g. by SelectAllCommand
  getPath () {
    return this.props.path
  }
}
