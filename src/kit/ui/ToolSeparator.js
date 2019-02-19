import { Component } from 'substance'

export default class ToolSeparator extends Component {
  render ($$) {
    const label = this.props.label
    let el = $$('div').addClass('sc-separator')
    if (label) {
      el.append(
        $$('div').addClass('se-label').append(
          this.getLabel(label)
        )
      )
    }
    return el
  }
}
