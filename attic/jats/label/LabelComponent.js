import { Component, TextPropertyEditor } from 'substance'

class LabelComponent extends Component {

  render($$) {
    let el = $$('div').addClass('sc-label')
    let node = this.props.node
    let labelEditor = $$(TextPropertyEditor, {
      disabled: this.props.disabled,
      path: node.getTextPath()
    }).ref('labelEditor')
    el.append(labelEditor)
    return el
  }
}

export default LabelComponent
