import { Surface } from 'substance'

export default class TextInput extends Surface {
  constructor (parent, props, options) {
    // monkey patching props to map context.editable to props that are understood by substance.Surface
    super(parent, _monkeyPatchProps(parent, props), options)
  }

  render ($$) {
    const TextPropertyComponent = this.getComponent('text-property')
    let placeholder = this.props.placeholder
    let path = this.props.path
    // TODO: we should refactor Substance.TextPropertyEditor so that it can be used more easily
    let el = Surface.prototype.render.apply(this, arguments)
    el.addClass('sc-text-input')
    if (!this.props.disabled) {
      el.addClass('sm-enabled')
      el.attr('contenteditable', true)
      // native spellcheck
      el.attr('spellcheck', this.props.spellcheck === 'native')
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
}

function _monkeyPatchProps (parent, props) {
  if (!parent.context.editable) {
    props.editing = 'readonly'
  }
  return props
}
