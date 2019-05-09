import { Component } from 'substance'

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
    this.context.appState.addObserver(['overlayHints'], this._positionOverlay, this, { stage: 'finalize' })
  }

  dispose () {
    super.dispose()

    this.context.appState.removeObserver(this)
  }

  didUpdate () {
    super.didUpdate()

    this._positionOverlay()
  }

  render ($$) {
    let el = $$('div').addClass('sc-overlay-canvas')
    // HACK: use 'sc-overlay' for now to inherit the styles
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

  acquireOverlay (comp) {
    if (this._hasBeenAcquired) {
      console.error('OverlayCanvas has already been acquire by', this._overlayContent)
    } else {
      this._overlayContent = comp
      this._hasBeenAcquired = true
    }
  }

  releaseOverlay (comp) {
    let currentComp = this._getCurrentOverlayContent()
    if (currentComp === comp) {
      this._clearCanvas()
    }
  }

  _resetAcquire () {
    this._hasBeenAcquired = false
    this._overlayContent = null
  }

  _injectOverlayContent () {
    let oldContent = this._getCurrentOverlayContent()
    if (oldContent !== this._overlayContent) {
      this._clearCanvas()
    }
    if (this._overlayContent) {
      this.refs.canvas.getElement().append(this._overlayContent.getElement())
    }
  }

  _getCurrentOverlayContent () {
    return this.refs.canvas.getChildAt(0)
  }

  _clearCanvas () {
    this.refs.canvas.getElement().empty()
  }

  _positionOverlay () {
    let hints = this.context.appState.get('overlayHints')
    if (hints && this._overlayContent) {
      this.el.removeClass('sm-hidden')
      let overlayWidth = this.el.htmlProp('offsetWidth')
      let selRect = hints.selectionRect
      if (selRect) {
        let selectionMaxWidth = selRect.width
        // By default, Overlays are aligned center/bottom to the selection
        this.el.css('top', selRect.top + selRect.height)
        let leftPos = selRect.left + selectionMaxWidth / 2 - overlayWidth / 2
        // Must not exceed left bound
        leftPos = Math.max(leftPos, 0)
        // Must not exceed right bound
        let maxLeftPos = selRect.left + selectionMaxWidth + selRect.right - overlayWidth
        leftPos = Math.min(leftPos, maxLeftPos)
        this.el.css('left', leftPos)
      } else {
        this.el.addClass('sm-hidden')
      }
    } else {
      this.el.addClass('sm-hidden')
    }
  }
}
