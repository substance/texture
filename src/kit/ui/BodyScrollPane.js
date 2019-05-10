import { DefaultDOMElement, platform } from 'substance'
import AbstractScrollPane from './AbstractScrollPane'

export default class BodyScrollPane extends AbstractScrollPane {
  /*
    Expose scrollPane as a child context
  */
  getChildContext () {
    return {
      scrollPane: this
    }
  }

  getName () {
    return 'body'
  }

  render ($$) {
    let el = $$('div')
    if (this.props.contextMenu === 'custom') {
      el.on('contextmenu', this._onContextMenu)
    }
    el.append(this.props.children)
    return el
  }

  /**
    Returns the height of scrollPane (inner content overflows)
  */
  getHeight () {
    if (platform.inBrowser) {
      return window.innerHeight
    } else {
      return 0
    }
  }

  /**
    Returns the cumulated height of a panel's content
  */
  getContentHeight () {
    if (platform.inBrowser) {
      return document.body.scrollHeight
    } else {
      return 0
    }
  }

  getContentElement () {
    if (platform.inBrowser) {
      return DefaultDOMElement.wrapNativeElement(window.document.body)
    } else {
      return null
    }
  }

  // /**
  //   Get the `.se-scrollable` element
  // */
  getScrollableElement () {
    if (platform.inBrowser) {
      return document.body
    } else {
      return null
    }
  }

  /**
    Get current scroll position (scrollTop) of `.se-scrollable` element
  */
  getScrollPosition () {
    if (platform.inBrowser) {
      return document.body.scrollTop
    } else {
      return 0
    }
  }

  setScrollPosition (scrollPos) {
    if (platform.inBrowser) {
      document.body.scrollTop = scrollPos
    }
  }

  /**
    Get offset relative to `.se-content`.

    @param {DOMNode} el DOM node that lives inside the
  */
  getPanelOffsetForElement(el) { // eslint-disable-line
    console.warn('TODO: implement')
  }

  /**
    Scroll to a given sub component.

    @param {String} componentId component id, must be present in data-id attribute
  */
  scrollTo(componentId, onlyIfNotVisible) { // eslint-disable-line
    console.warn('TODO: implement')
  }
}
