import { Component, getRelativeRect } from 'substance'

export default class OverlayCanvas extends Component {
  constructor (...args) {
    super(...args)

    this._hasBeenAcquired = false
  }

  didMount () {
    super.didMount()

    this._positionOverlay()

    // TODO: avoid using appState directly, instead use a Managed component
    this.context.appState.addObserver(['@any'], this._resetAcquire, this, { stage: 'update' })
    this.context.appState.addObserver(['@any'], this._injectOverlayContent, this, { stage: 'post-render' })
    this.context.appState.addObserver(['@any'], this._positionOverlay, this, { stage: 'finalize' })
  }

  dispose () {
    super.dispose()

    this.context.appState.removeObserver(this)
  }

  didUpdate () {
    super.didUpdate()

    this._positionOverlay()
  }

  // This component manages itself and does not need to be rerendered
  shouldRerender () { return false }

  render ($$) {
    let el = $$('div').addClass('sc-overlay-canvas sc-overlay')
    // LEGACY: using the styles of the former Overlay component
    // TODO: at some point we should rename the styles to 'sc-overlay-canvas'
    el.addClass('sc-overlay')
    el.addClass('sm-hidden')
    el.addClass('sm-theme-' + this.getTheme())
    el.append(
      $$('div').addClass('se-canvas').ref('canvas')
    )
    return el
  }

  getTheme () {
    // HACK: falling back to 'light' in a hard-coded way
    return this.props.theme || 'light'
  }

  acquireOverlay (comp, options = {}) {
    if (this._hasBeenAcquired) {
      console.error('OverlayCanvas has already been acquire by', this._overlayContent)
    } else {
      // a guard to make sure the overlay is not acquired
      this._hasBeenAcquired = true
      // the component and options
      this._overlayContent = comp
      this._overlayOptions = options
    }
  }

  releaseOverlay (comp) {
    let currentComp = this._getCurrentOverlayContent()
    if (currentComp === comp) {
      this._clearCanvas()
      this._overlayContent = null
      this._overlayOptions = null
    }
  }

  _resetAcquire () {
    this._hasBeenAcquired = false
  }

  _injectOverlayContent () {
    let oldContent = this._getCurrentOverlayContent()
    if (oldContent !== this._overlayContent) {
      this._clearCanvas()
      if (this._overlayContent) {
        this.refs.canvas.getElement().append(this._overlayContent.getElement())
      }
    }
  }

  _getCurrentOverlayContent () {
    return this.refs.canvas.getChildAt(0)
  }

  _clearCanvas () {
    this.refs.canvas.getElement().empty()
  }

  _getContentPanel () {
    return this.props.panel || this.props.panelProvider()
  }

  _positionOverlay () {
    if (!this._overlayContent) {
      this.el.addClass('sm-hidden')
      return
    }
    const contentPanel = this._getContentPanel()
    let contentRect = contentPanel._getContentRect()
    let anchorEl = this._overlayOptions.anchor
    let anchorRect
    let scrollIntoView = false
    if (anchorEl) {
      anchorRect = getRelativeRect(contentRect, anchorEl.getNativeElement().getBoundingClientRect())
    } else {
      anchorRect = contentPanel._getSelectionRect()
      scrollIntoView = true
    }
    this.el.removeClass('sm-hidden')
    let overlayWidth = this.el.htmlProp('offsetWidth')
    // TODO: is it really possible that this is null?
    if (anchorRect) {
      let anchorMaxWidth = anchorRect.width
      // By default, Overlays are aligned center/bottom to the selection
      this.el.css('top', anchorRect.top + anchorRect.height)
      let leftPos = anchorRect.left + anchorMaxWidth / 2 - overlayWidth / 2
      // Must not exceed left bound
      leftPos = Math.max(leftPos, 0)
      // Must not exceed right bound
      let maxLeftPos = anchorRect.left + anchorMaxWidth + anchorRect.right - overlayWidth
      leftPos = Math.min(leftPos, maxLeftPos)
      this.el.css('left', leftPos)
      if (scrollIntoView) {
        contentPanel._scrollRectIntoView(anchorRect)
      }
    } else {
      this.el.addClass('sm-hidden')
    }
  }
}
