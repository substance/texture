import { Component } from 'substance'
import { getLabel } from '../shared/nodeHelpers'
import OptionComponent from './OptionComponent'

export default class FigureOptionComponent extends Component {
  render ($$) {
    return $$(OptionComponent, {
      id: this.props.model.id,
      selected: this.props.selected,
      // TODO: for some reason we can't pass a VirtualComponent here
      // thumbnail: this._getThumbnail($$),
      label: this._getLabel()
    })
  }

  _getThumbnail ($$) {
    let contentNode = this.props.model.getContent().model.getValue()
    contentNode = this.context.api.getModel(contentNode)._node

    if (contentNode) {
      let comp = $$(this.getComponent(contentNode.type), {
        node: contentNode,
        disabled: this.props.disabled
      })
      return comp
    }
  }

  _getLabel () {
    return getLabel(this.props.node)
  }
}
