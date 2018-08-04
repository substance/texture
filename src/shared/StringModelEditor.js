import { Component, Surface, TextPropertyComponent } from 'substance'

export default class StringModelEditor extends Component {
  render ($$) {
    let label = this.props.label
    let model = this.props.model
    let path = model._path
    // TODO: use label provider for this
    let placeholder = 'Enter ' + label
    let el = $$('div').addClass('sc-string-model-editor')
    el.append($$(TextInput, {
      name: path.join('.'),
      path,
      placeholder
    }))
    return el
  }
}

class TextInput extends Surface {
  render ($$) {
    let placeholder = this.props.placeholder
    let path = this.props.path
    // TODO: we should refactor Substance.TextPropertyEditor
    // so that it can be used more easily
    // Particularly, it should be easier to implement a customized Surface
    let el = Surface.prototype.render.apply(this, arguments)
    el.addClass('sc-text-input')
    if (!this.props.disabled) {
      el.addClass('sm-enabled')
      el.attr('contenteditable', true)
      // native spellcheck
      el.attr('spellcheck', this.props.spellcheck === 'native')
    }
    let content = $$(TextPropertyComponent, {
      tagName: 'div',
      placeholder,
      path
    }).ref('property').addClass('se-input')
    el.append(content)
    return el
  }
}
