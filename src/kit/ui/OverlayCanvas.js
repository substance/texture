import { Component, getRelativeRect } from 'substance'

export default class OverlayCanvas extends Component {
  constructor (...args) {
    super(...args)

    this._items = new Map()
  }
  didMount () {
    super.didMount()

    this._positionOverlay()

    // TODO: avoid using appState directly, instead use a Managed component
    this.context.appState.addObserver(['@any'], this._reset, this, { stage: 'update' })
    this.context.appState.addObserver(['@any'], this._updateOverlayCanvas, this, { stage: 'post-render' })
    this.context.appState.addObserver(['@any'], this._positionOverlay, this, { stage: 'position' })
  }

  dispose () {
    super.dispose()

    this.context.appState.removeObserver(this)
    this._items.length = 0
    this.refs.canvas.empty()
  }

  didUpdate () {
    super.didUpdate()

    this._positionOverlay()
  }

  // This component manages itself and does not need to be rerendered
  shouldRerender () { return false }

  render ($$) {
    let el = $$('div').addClass('sc-overlay-canvas')
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
    if (!this._items.has(comp.__id__)) console.log('acquiring overlay', comp, comp.__id__)
    this._toBeAdded.push({ comp, options })
  }

  releaseOverlay (comp) {
    if (this._items.has(comp.__id__)) {
      console.log('releasing overlay', comp, comp.__id__)
      this._toBeRemoved.push(comp)
    }
  }

  _reset () {
    this._toBeAdded = []
    this._toBeRemoved = []
  }

  _updateOverlayCanvas () {
    this._toBeRemoved.forEach(comp => {
      this._items.delete(comp.__id__)
      comp.el.remove()
    })
    this._toBeAdded.forEach(entry => {
      let id = entry.comp.__id__
      let alreadyThere = this._items.has(id)
      this._items.set(id, entry)
      if (!alreadyThere) {
        this.refs.canvas.getElement().append(entry.comp.getElement())
      }
    })
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
    if (this._items.size === 0) {
      this.el.addClass('sm-hidden')
      return
    }
    const firstItem = this._items.values().next().value
    const contentPanel = this._getContentPanel()
    let contentRect = contentPanel._getContentRect()
    let anchorEl = firstItem.options.anchor
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
