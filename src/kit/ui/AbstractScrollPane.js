import {
  Component, DefaultDOMElement, platform, getSelectionRect, getRelativeMouseBounds, getRelativeRect
} from 'substance'

export default class AbstractScrollPane extends Component {
  getActionHandlers () {
    return {
      'scrollSelectionIntoView': this._scrollSelectionIntoView
    }
  }
  /*
    Expose scrollPane as a child context
  */
  getChildContext () {
    return {
      scrollPane: this
    }
  }

  didMount () {
    if (platform.inBrowser) {
      this.windowEl = DefaultDOMElement.wrapNativeElement(window)
      this.windowEl.on('resize', this._onResize, this)
    }
    // FIXME: we need to define when exactly this must be executed
    // ATM this causes trouble when
    this.context.appState.addObserver(['@any'], this._afterRender, this, { stage: 'position' })
  }

  dispose () {
    if (this.windowEl) {
      this.windowEl.off(this)
    }
    this.context.appState.off(this)
  }

  getName () {
    return this.props.name
  }

  _computeOverlayHints () {
    let contentRect = this._getContentRect()
    let selectionRect = this._getSelectionRect()
    return {
      contentRect,
      selectionRect
    }
  }

  _reduceOverlayHints (hints) {
    // TODO: introduce a reducer for this
    this.context.appState.set('overlayHints', hints)
  }

  /*
    Determine selection rectangle relative to content element
    and emit a selection:positioned event with positioning hints
  */
  _position () {
    let hints = this._computeOverlayHints()
    if (hints) {
      this._reduceOverlayHints(hints)
      // TODO: this is problematic and needs to be approached in
      // a different way.
      // Now we use overlays not only for selection anchored popups
      // but also for menu dropdowns.
      // Only for cases where the overlay needs to be position with a selection
      // we should do that. I.e. I guess this should not be considered here at all
      // but rather done along with the selection rendering
      // this._scrollSelectionIntoView(hints.selectionRect)
    }
  }

  _afterRender () {
    this._position()
  }

  _onResize () {
    this._position()
  }

  /*
    Determine mouse bounds relative to content element
    and emit context-menu:opened event with positioning hints
  */
  _onContextMenu (e) {
    e.preventDefault()
    let mouseBounds = this._getMouseBounds(e)
    this.emit('context-menu:opened', {
      mouseBounds: mouseBounds
    })
  }

  _scrollSelectionIntoView () {
    // console.log('AbstractScrollPane._scrollSelectionIntoView()')
    let hints = this.context.appState.get('overlayHints')
    if (!hints) {
      // console.log('...no hints')
      return
    }
    let selectionRect = hints.selectionRect
    if (!selectionRect) {
      // console.log('...no selection rect')
      return
    }
    let upperBound = this.getScrollPosition()
    let lowerBound = upperBound + this.getHeight()
    let selTop = selectionRect.top
    let selBottom = selectionRect.top + selectionRect.height
    if ((selTop < upperBound && selBottom < upperBound) ||
        (selTop > lowerBound && selBottom > lowerBound)) {
      this.setScrollPosition(selTop)
    }
  }

  /**
    Returns the height of scrollPane (inner content overflows)
  */
  getHeight () {
    throw new Error('Abstract method')
  }

  /**
    Returns the cumulated height of a panel's content
  */
  getContentHeight () {
    throw new Error('Abstract method')
  }

  getContentElement () {
    // TODO: should be wrapped in DefaultDOMElement
    throw new Error('Abstract method')
  }

  /**
    Get the `.se-scrollable` element
  */
  getScrollableElement () {
    throw new Error('Abstract method')
  }

  /**
    Get current scroll position (scrollTop) of `.se-scrollable` element
  */
  getScrollPosition () {
    throw new Error('Abstract method')
  }

  setScrollPosition () {
    throw new Error('Abstract method')
  }

  /**
    Get offset relative to `.se-content`.

    @param {DOMNode} el DOM node that lives inside the
  */
  getPanelOffsetForElement(el) { // eslint-disable-line
    throw new Error('Abstract method')
  }

  /**
    Scroll to a given sub component.

    @param {String} componentId component id, must be present in data-id attribute
  */
  scrollTo(componentId, onlyIfNotVisible) { // eslint-disable-line
    throw new Error('Abstract method')
  }

  _getContentRect () {
    return this.getContentElement().getNativeElement().getBoundingClientRect()
  }

  /*
    Get selection rectangle relative to panel content element
  */
  _getSelectionRect () {
    let appState = this.context.appState
    let sel = appState.selection
    let selectionRect
    if (platform.inBrowser && sel && !sel.isNull()) {
      let contentEl = this.getContentElement()
      let contentRect = contentEl.getNativeElement().getBoundingClientRect()
      if (sel.isNodeSelection()) {
        let nodeId = sel.nodeId
        let nodeEl = contentEl.find(`*[data-id="${nodeId}"]`)
        let nodeRect = nodeEl.getNativeElement().getBoundingClientRect()
        selectionRect = getRelativeRect(contentRect, nodeRect)
      } else {
        selectionRect = getSelectionRect(contentRect)
      }
    }
    return selectionRect
  }

  _getMouseBounds (e) {
    return getRelativeMouseBounds(e, this.getContentElement().getNativeElement())
  }
}
