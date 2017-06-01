import { Component, TextPropertyEditor } from 'substance'

class TitleComponent extends Component {

  render($$) {
    let el = $$('div').addClass('sc-title')
    let node = this.props.node
    let titleEditor = $$(TextPropertyEditor, {
      disabled: this.props.disabled,
      path: node.getTextPath()
    }).ref('titleEditor')
    el.append(titleEditor)
    return el
  }
}

export default TitleComponent
