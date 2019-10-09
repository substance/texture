import { platform, getRelativeBoundingRect, $$, AbstractScrollPane } from 'substance'

export default class ScrollPane extends AbstractScrollPane {
  render () {
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

    el.append(
      $$('div').ref('scrollable').addClass('se-scrollable').append(
        this.renderContent()
      ).on('scroll', this.onScroll)
    )
    return el
  }

  renderContent () {
    let contentEl = $$('div').ref('content').addClass('se-content')
    contentEl.append(this.props.children)
    return contentEl
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
}
