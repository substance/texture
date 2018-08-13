import { Component } from 'substance'

export default class CardComponent extends Component {
  render ($$) {
    const children = this.props.children

    return $$('div').addClass('sc-card')
      .append(children)
  }
}
