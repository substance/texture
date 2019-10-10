import { Component, FontAwesomeIcon, $$ } from 'substance'

export default class PinnedMessage extends Component {
  render () {
    const icon = this.props.icon
    const label = this.props.label

    const el = $$('div').addClass('sc-pinned-message')
    const wrapper = $$('div').addClass('se-msg-wrap')

    if (icon) {
      wrapper.append(
        $$(FontAwesomeIcon, { icon }).addClass('se-icon')
      )
    }

    if (label) {
      wrapper.append(
        $$('div').addClass('se-msg')
          .append(label)
      )
    }

    el.append(wrapper)

    return el
  }
}
