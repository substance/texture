import { Component } from 'substance'
import { ifNodeOrRelatedHasChanged } from '../shared/nodeHelpers'

export default class ModelPreviewComponent extends Component {
  didMount () {
    this.context.appState.addObserver(['document'], this._onDocumentChange, this, { stage: 'render' })
  }

  dispose () {
    this.context.appState.removeObserver(this)
  }

  render ($$) {
    let node = this.props.node
    let el = $$('div').addClass('sc-model-preview')
    el.html(
      // TODO: rethink this. IMO rendering should not be part of the Article API
      // Either it could be part of the general Model API, i.e. model.previewHtml()
      // or we could use some kind of configurable renderer, very much like a converter
      this.context.api.renderEntity(node)
    )
    return el
  }

  _onDocumentChange (change) {
    ifNodeOrRelatedHasChanged(this.props.node, change, () => this.rerender())
  }
}
