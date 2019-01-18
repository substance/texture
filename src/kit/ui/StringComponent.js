import { Component } from 'substance'
import TextInput from './TextInput'

export default class StringComponent extends Component {
  render ($$) {
    let placeholder = this.props.placeholder
    let model = this.props.model
    let path = model.getPath()
    let name = path.join('.')
    let el = $$('div').addClass(this.getClassNames())
    if (this.props.readOnly) {
      let doc = this.context.api.getDocument()
      let TextPropertyComponent = this.getComponent('text-property')
      el.append(
        $$(TextPropertyComponent, {
          doc,
          tagName: 'div',
          placeholder,
          path
        }).ref('display')
      )
    } else {
      el.append(
        $$(TextInput, {
          name,
          path,
          placeholder
        }).ref('input')
      )
    }
    return el
  }

  getClassNames () {
    return 'sc-string'
  }
}
