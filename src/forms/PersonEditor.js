import { Component } from 'substance'

export default class PersonEditor extends Component {
  render($$) {
    const el = $$('div').addClass('sc-person-editor').append(
      $$('div').addClass('se-header').append(this.props.name)
    )
    el.append(this.props.children)
    return el
  }
}
