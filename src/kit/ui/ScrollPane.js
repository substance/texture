import { platform, getRelativeBoundingRect, Scrollbar } from 'substance'
import AbstractScrollPane from './AbstractScrollPane'

/**
  Wraps content in a scroll pane.

  NOTE: It is best practice to put all overlays as direct childs of the ScrollPane
        to reduce the chance that positioning gets messed up (position: relative)

  @prop {String} scrollbarType 'native' or 'substance' for a more advanced visual scrollbar. Defaults to 'native'
  @prop {String} [scrollbarPosition] 'left' or 'right' only relevant when scrollBarType: 'substance'. Defaults to 'right'
  @prop {ui/Highlights} [highlights] object that maintains highlights and can be manipulated from different sources

  @example

  ```js
  $$(ScrollPane, {
    scrollbarType: 'substance', // defaults to native
    scrollbarPosition: 'left', // defaults to right
    onScroll: this.onScroll.bind(this),
    highlights: this.contentHighlights,
  })
  ```
*/
export default class ScrollPane extends AbstractScrollPane {
  didMount () {
    super.didMount()

    if (this.refs.scrollbar) {
      if (platform.inBrowser) {
        this.domObserver = new window.MutationObserver(this._onContentChanged.bind(this))
        this.domObserver.observe(this.el.getNativeElement(), {
          subtree: true,
          attributes: true,
          characterData: true,
          childList: true
        })
      }
    }
  }

  dispose () {
    super.dispose()

    if (this.domObserver) {
      this.domObserver.disconnect()
    }
  }

  render ($$) {
    let el = $$('div')
      .addClass('sc-scroll-pane')

    if (platform.isFF) {
      el.addClass('sm-firefox')
    }

    // When noStyle is provided we just use ScrollPane as a container, but without
    // any absolute positioned containers, leaving the body scrollable.
    if (!this.props.noStyle) {
      el.addClass('sm-default-style')
    }

    // Initialize Substance scrollbar (if enabled)
    if (this.props.scrollbarType === 'substance') {
      el.addClass('sm-substance-scrollbar')
      el.addClass('sm-scrollbar-position-' + this.props.scrollbarPosition)

      el.append(
        // TODO: is there a way to pass scrollbar highlights already
        // via props? Currently the are initialized with a delay
        $$(Scrollbar, {
          scrollPane: this
        }).ref('scrollbar')
          .attr('id', 'content-scrollbar')
      )

      // Scanline is debugging purposes, display: none by default.
      el.append(
        $$('div').ref('scanline').addClass('se-scanline')
      )
    }

    el.append(
      $$('div').ref('scrollable').addClass('se-scrollable').append(
        this.renderContent($$)
      ).on('scroll', this.onScroll)
    )
    return el
  }

  renderContent ($$) {
    let contentEl = $$('div').ref('content').addClass('se-content')
    contentEl.append(this.props.children)
    if (this.props.contextMenu === 'custom') {
      contentEl.on('contextmenu', this._onContextMenu)
    }
    return contentEl
  }

  _onContentChanged () {
    this._contentChanged = true
  }

  _afterRender () {
    super._afterRender()

    if (this.refs.scrollbar && this._contentChanged) {
      this._contentChanged = false
      this._updateScrollbar()
    }
  }

  _updateScrollbar () {
    if (this.refs.scrollbar) {
      this.refs.scrollbar.updatePositions()
    }
  }

  onScroll () {
    let scrollPos = this.getScrollPosition()
    let scrollable = this.refs.scrollable
    if (this.props.onScroll) {
      this.props.onScroll(scrollPos, scrollable)
    }
    this.emit('scroll', scrollPos, scrollable)
  }

  /**
    Returns the height of scrollPane (inner content overflows)
  */
  getHeight () {
    let scrollableEl = this.getScrollableElement()
    return scrollableEl.height
  }

  /**
    Returns the cumulated height of a panel's content
  */
  getContentHeight () {
    let contentEl = this.refs.content.el.getNativeElement()
    // Important to use scrollHeight here (e.g. to consider overflowing
    // content, that stretches the content area, such as an overlay or
    // a context menu)
    return contentEl.scrollHeight
  }

  /**
    Get the `.se-content` element
  */
  getContentElement () {
    return this.refs.content.el
  }

  /**
    Get the `.se-scrollable` element
  */
  getScrollableElement () {
    return this.refs.scrollable.el
  }

  /**
    Get current scroll position (scrollTop) of `.se-scrollable` element
  */
  getScrollPosition () {
    let scrollableEl = this.getScrollableElement()
    return scrollableEl.getProperty('scrollTop')
  }

  setScrollPosition (scrollPos) {
    // console.log('ScrollPane.setScrollPosition()')
    let scrollableEl = this.getScrollableElement()
    scrollableEl.setProperty('scrollTop', scrollPos)
  }

  /**
    Get offset relative to `.se-content`.

    @param {DOMNode} el DOM node that lives inside the
  */
  getPanelOffsetForElement (el) {
    let contentContainerEl = this.refs.content.el
    let rect = getRelativeBoundingRect(el, contentContainerEl)
    return rect.top
  }

  /**
    Scroll to a given sub component.

    @param {String} componentId component id, must be present in data-id attribute
  */
  scrollTo (selector, onlyIfNotVisible) {
    // console.log('ScrollPane.scrollTo()', selector)
    let scrollableEl = this.getScrollableElement()
    let el = scrollableEl.find(selector)
    if (el) {
      this.scrollElementIntoView(el, onlyIfNotVisible)
    } else {
      console.warn(`No match found for selector '${selector}' in scrollable container`)
    }
  }

  scrollElementIntoView (el, onlyIfNotVisible) {
    // console.log('ScrollPane.scrollTo()', selector)
    let scrollableEl = this.getScrollableElement()
    const offset = this.getPanelOffsetForElement(el)
    let shouldScroll = true
    if (onlyIfNotVisible) {
      const height = scrollableEl.height
      const oldOffset = scrollableEl.getProperty('scrollTop')
      shouldScroll = (offset < oldOffset || oldOffset + height < offset)
    }
    if (shouldScroll) {
      this.setScrollPosition(offset)
    }
  }

  _onResize (...args) {
    super._onResize(...args)
    this._updateScrollbar()
  }

  _onContextMenu (e) {
    super._onContextMenu(e)
    this._updateScrollbar()
  }
}
