import { findChild } from '../util/domHelpers'
import { getLabel } from '../../shared/nodeHelpers'

export default class FigConverter {
  get type () { return 'figure' }

  get tagName () { return 'fig' }

  import (el, node, importer) {
    let labelEl = findChild(el, 'label')
    let contentEl = this._getContent(el)
    let captionEl = findChild(el, 'caption')
    let titleEl
    if (captionEl) {
      titleEl = findChild(captionEl, 'title')
    }

    if (labelEl) {
      node.label = labelEl.text()
    }
    if (titleEl) {
      node.title = importer.annotatedText(titleEl, [node.id, 'title'])
    }
    if (contentEl) {
      node.content = importer.convertElement(contentEl).id
    }
    if (captionEl) {
      let children = captionEl.children
      for (let idx = children.length - 1; idx >= 0; idx--) {
        let child = children[idx]
        if (child.tagName !== 'p') {
          captionEl.removeAt(idx)
        }
      }
      node.caption = importer.convertElement(captionEl).id
    }
  }

  _getContent (el) {
    return findChild(el, 'graphic')
  }

  export (node, el, exporter) {
    let $$ = exporter.$$
    let doc = exporter.getDocument()

    // ATTENTION: this helper retrieves the label from the state
    let label = getLabel(node)
    if (label) {
      el.append($$('label').text(label))
    }
    // Attention: <title> is part of the <caption>
    if (node.title || node.caption) {
      let caption = node.getCaption()
      let captionEl
      if (caption) {
        captionEl = exporter.convertNode(caption)
      }
      if (node.title) {
        // Note: this would happen if title is set, but no caption
        if (!captionEl) captionEl = $$('caption')
        captionEl.insertAt(0,
          $$('title').append(
            exporter.annotatedText([node.id, 'title'])
          )
        )
      }
      el.append(captionEl)
    }
    if (node.content) {
      el.append(
        exporter.convertNode(doc.get(node.content))
      )
    }
  }
}
