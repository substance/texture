import { SurfaceNew } from './SubstanceModifications'

export default class TextInput extends SurfaceNew {
  render ($$) {
    const TextPropertyComponent = this.getComponent('text-property')
    const placeholder = this.props.placeholder
    const path = this.props.path
    const isEditable = this.isEditable()
    // TODO: we should refactor Substance.TextPropertyEditor so that it can be used more easily
    let el = SurfaceNew.prototype.render.apply(this, arguments)
    el.addClass('sc-text-input')
    // Attention: being disabled does not necessarily mean not-editable, whereas non-editable is always disabled
    // A Surface can also be disabled because it is blurred, for instance.
    if (isEditable) {
      el.addClass('sm-editable')
      if (!this.props.disabled) {
        el.addClass('sm-enabled')
        el.attr('contenteditable', true)
        // native spellcheck
        el.attr('spellcheck', this.props.spellcheck === 'native')
      }
    } else {
      el.addClass('sm-readonly')
    }
    let content = $$(TextPropertyComponent, {
      doc: this.getDocument(),
      tagName: 'div',
      placeholder,
      path
    }).ref('property').addClass('se-input')
    el.append(content)
    return el
  }

  // HACK: this is needed e.g. by SelectAllCommand
  get _isTextPropertyEditor () {
    return true
  }

  // HACK: this is needed e.g. by SelectAllCommand
  getPath () {
    return this.props.path
  }
}
