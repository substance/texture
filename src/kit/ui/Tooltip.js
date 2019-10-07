import { Component, $$ } from 'substance'

/**
  @param {string} props.text
*/
export default class Tooltip extends Component {
  render () {
    let el = $$('div').addClass('sc-tooltip')
    el.append(this.props.text)
    return el
  }
}
