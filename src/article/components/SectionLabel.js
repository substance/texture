import { Component, $$ } from 'substance'

export default class SectionLabel extends Component {
  render () {
    const label = this.props.label
    return $$('div').addClass('sc-section-label')
      .append(label)
  }
}
