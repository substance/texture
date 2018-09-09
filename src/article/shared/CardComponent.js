import { Component } from 'substance'

export default class CardComponent extends Component {
  render ($$) {
    const children = this.props.children
    const label = this.getLabel(this.props.label)

    const el = $$('div').addClass('sc-card')
      .append(
        $$('div').addClass('se-label').append(label)
      )

    el.append(children)

    return el
  }
}
