import { TextPropertyComponent as SubstanceTextPropertyComponent, getKeyForPath } from 'substance'

/**
 * Overriding the original implementation
 * 1. to retrieve markers from MarkersManager in addition to Annotations
 * 2. to change the way how place-holders are rendered
 * 3. to provide default implementation for unsupported inline nodes
*/
export default class TextPropertyComponentNew extends SubstanceTextPropertyComponent {
  didMount () {
    this.context.appState.addObserver(['document'], this.rerender, this, { stage: 'render', document: { path: this.getPath() } })
  }

  dispose () {
    this.context.appState.off(this)
  }

  render ($$) {
    let path = this.getPath()

    let el = this._renderContent($$)
      .addClass('sc-text-property')
      .attr({
        'data-path': getKeyForPath(path)
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

  getAnnotations () {
    let path = this.getPath()
    let annos = this.getDocument().getAnnotations(path) || []
    let markersManager = this.context.markersManager
    if (markersManager) {
      annos = annos.concat(markersManager.getMarkers(path))
    }
    return annos
  }

  _getUnsupportedInlineNodeComponentClass () {
    return this.getComponent('unsupported-inline-node')
  }
}
