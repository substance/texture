import { Component } from 'substance'

/*
  Used to edit relationhips to other entities.

  On confirmation emits a change event carrying the property name and
  an array of entity ids.
*/
export default class FormLabel extends Component {

  render($$) {
    let el = $$('div').addClass('sc-form-label')
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
