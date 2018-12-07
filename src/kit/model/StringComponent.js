import { Component } from 'substance'
import TextInput from '../ui/TextInput'

export default class StringComponent extends Component {
  render ($$) {
    let label = this.props.label
    let placeholder = this.props.placeholder
    let model = this.props.model
    let path = model._path
    let name = path.join('.')
    // TODO: use label provider for this
    placeholder = placeholder || 'Enter ' + label
    let el = $$('div').addClass(this.getClassNames())
    el.append(
      $$(TextInput, {
        name,
        path,
        placeholder
      }).ref('input')
    )
    return el
  }

  getClassNames () {
    return 'sc-string'
  }
}
