import { Component } from 'substance'

export default class Popup extends Component {
  render ($$) {
    const label = this.props.label
    const children = this.props.children

    const el = $$('div').addClass('sc-popup').append(
      $$('div').addClass('se-popup-arrow')
    )

    if (label) {
      el.append(
        $$('div').addClass('se-popup-label').append(label)
      )
    }

    el.append(
      $$('div').addClass('se-popup-content').append(children)
    )

    return el
  }
}
