import { Component, $$ } from 'substance'

export default class InputWithButton extends Component {
  render () {
    let input = this.props.input
    let button = this.props.button

    let el = $$('div').addClass('sc-input-with-button')

    if (input) el.append(input.addClass('se-input'))
    if (button) el.append(button.addClass('se-button'))

    return el
  }
}
