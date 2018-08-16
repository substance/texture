import { findChild } from '../util/domHelpers'
import { getLabel } from '../../shared/nodeHelpers'

export default class FigConverter {
  get type () { return 'figure' }

  get tagName () { return 'fig' }

  import (el, node, importer) {
    let $$ = el.createElement.bind(el.getOwnerDocument())
    let labelEl = findChild(el, 'label')
    let contentEl = this._getContent(el)
    let captionEl = findChild(el, 'caption')
    // Preparations:
    if (!captionEl) {
      captionEl = $$('caption')
    }
    let titleEl = findChild(captionEl, 'title')
    if (!titleEl) {
      titleEl = $$('title')
    }
    // drop everything than 'p' from caption
    let captionContent = captionEl.children
    for (let idx = captionContent.length - 1; idx >= 0; idx--) {
      let child = captionContent[idx]
      if (child.tagName !== 'p') {
        captionEl.removeAt(idx)
      }
    }
    // there must be at least one paragraph
    if (!captionEl.find('p')) {
      captionEl.append($$('p'))
    }

    // Conversion
    if (labelEl) {
      node.label = labelEl.text()
    }
    node.title = importer.annotatedText(titleEl, [node.id, 'title'])
    // content is optional
    // TODO: really?
    if (contentEl) {
      node.content = importer.convertElement(contentEl).id
    }
    node.caption = importer.convertElement(captionEl).id
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
