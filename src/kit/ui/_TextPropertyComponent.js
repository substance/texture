import { TextPropertyComponent as SubstanceTextPropertyComponent } from 'substance'

/*
  Overriding the original implementation
  - 1. to be able to pass down Model instances to inline nodes and annotations
  - 2. to change the way how place-holders are rendered
*/
export default class TextPropertyComponentNew extends SubstanceTextPropertyComponent {
  // ATTENTION: need to override this because we need to change the behavior of registration.
  // In the current implementation in MarkersManager, it is only allowed to register one TextPropertComponent per path
  // without registration, there are no updates.
  didMount () {
    const markersManager = this.context.markersManager
    if (markersManager) {
      this._isRegistered = markersManager.register(this)
    }
    // if not managed by the MarkersManager we let the component be updated directly
    if (!this._isRegistered) {
      this.context.appState.addObserver(['document'], this.rerender, this, { document: { path: this.getPath() } })
    }
  }

  dispose () {
    if (this._isRegistered) {
      this.context.markersManager.deregister(this)
    } else {
      this.context.appState.off(this)
    }
  }

  render ($$) {
    let path = this.getPath()

    let el = this._renderContent($$)
      .addClass('sc-text-property')
      .attr({
        'data-path': path.join('.')
      })
      .css({
        'white-space': 'pre-wrap'
      })

    if (this.isEmpty()) {
      el.addClass('sm-empty')
      if (this.props.placeholder) {
        el.setAttribute('data-placeholder', this.props.placeholder)
      }
    }

    if (!this.props.withoutBreak) {
      el.append($$('br'))
    }

    return el
  }

  _getFragmentComponentClass (node, noDefault) {
    return super._getFragmentComponentClass(node, noDefault)
  }

  _getUnsupportedInlineNodeComponentClass () {
    return this.getComponent('unsupported-inline-node')
  }
}
