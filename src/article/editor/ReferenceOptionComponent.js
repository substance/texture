import { renderEntity } from '../shared/entityHelpers'

import { Component } from 'substance'
import OptionComponent from './OptionComponent'

export default class ReferenceOptionComponent extends Component {
  render ($$) {
    return $$(OptionComponent, {
      id: this.props.model.id,
      selected: this.props.selected,
      label: this._getLabel(),
      description: this._getDescription($$)
    })
  }

  _getLabel () {
    const refNode = this.props.node
    return _getReferenceLabel(refNode)
  }

  _getDescription () {
    const refNode = this.props.node
    let html = renderEntity(refNode)
    // TODO: do we want to display something like this
    // if so, use the label provider
    html = html || '<i>Not available</i>'
    return html
  }
}

function _getReferenceLabel (refNode) {
  if (refNode.state && refNode.state.label) {
    return refNode.state.label
  }
  return '?'
}
