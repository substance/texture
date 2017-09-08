import { Component, FontAwesomeIcon as Icon } from 'substance'

export default class Button extends Component {

  render($$) {
    let label = this.props.label
    let icon = this.props.icon
    let style = this.props.style || 'default'
    let tooltip = this.props.tooltip

    let el = $$('button').addClass('sc-button sm-style-' + style)

    if(icon) {
      el.append(
        $$(Icon, {icon: 'fa-' + icon}).addClass('se-icon')
      )
    }

    if(label) {
      el.append(
        $$('div').addClass('se-label').append(label)
      )
    }

    if(tooltip) {
      el.append(
        $$('span').addClass('se-tooltip').append(tooltip)
      )
    }

    return el
  }

}
