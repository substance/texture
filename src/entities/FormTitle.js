import { Component } from 'substance'

export default class FormTitle extends Component {

  render($$) {
    let el = $$('div').addClass('sc-form-title')
    el.append(
      this._getLabel(this.props.name)
    )
    return el
  }

  _getLabel(name) {
    let labelProvider = this.context.labelProvider
    return labelProvider.getLabel(name)
  }

}
