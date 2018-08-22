import { Component } from 'substance'
import TextInput from './TextInput'

export default class StringComponent extends Component {
  render ($$) {
    let label = this.props.label
    let model = this.props.model
    let path = model._path
    // TODO: use label provider for this
    let placeholder = 'Enter ' + label
    let el = $$('div').addClass(this.getClassNames())
    el.append($$(TextInput, {
      name: path.join('.'),
      path,
      placeholder
    }))
    return el
  }

  getClassNames () {
    return 'sc-string'
  }
}
