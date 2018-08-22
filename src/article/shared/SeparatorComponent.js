import { Component } from 'substance'

export default class SeparatorComponent extends Component {
  render ($$) {
    let label = this.props.label
    let el = $$('div').addClass('sc-separator')
      .append(
        $$('span').addClass('se-label').append(this.getLabel(label))
      )

    return el
  }
}
