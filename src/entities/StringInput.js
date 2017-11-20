import { Component } from 'substance'

export default class StringInput extends Component {

  render($$) {
    return $$('div').addClass('sc-string-input').append(
      $$('input').attr({
        type: 'text', value: this.props.value // this.state.node[propertyName]
      }).ref('input')
    )
  }

  getValue() {
    return this.refs.input.val()
  }
}
