import { Component } from 'substance'

export default class CardComponent extends Component {
  render ($$) {
    const children = this.props.children
    const label = this.getLabel(this.props.label)
    const el = $$('div').addClass('sc-card')
      .append(
        $$('div').addClass('se-label').append(label)
      )
    if (this.state.selected) {
      el.addClass('sm-selected')
    }
    el.append(children)
    el.on('click', this._toggleCardSelection)
    return el
  }

  _toggleCardSelection () {
    console.log('this.state.selected', this.state.selected)
    this.setState({
      selected: !this.state.selected
    })
  }
}
