import { Component } from 'substance'
import { getLabel } from '../shared/nodeHelpers'
import OptionComponent from './OptionComponent'

export default class FootnoteOptionComponent extends Component {
  render ($$) {
    return $$(OptionComponent, {
      id: this.props.model.id,
      selected: this.props.selected,
      label: this._getLabel(),
      description: this._getDescription()
    })
  }

  _getDescription ($$) {
    return 'TODO: render footnote content'
  }

  _getLabel () {
    return getLabel(this.props.node)
  }
}
