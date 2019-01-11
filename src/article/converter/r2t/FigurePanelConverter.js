import { findChild, retainChildren } from '../util/domHelpers'
import { getLabel } from '../../shared/nodeHelpers'

export default class FigurePanelConverter {
  get type () { return 'figure-panel' }

  // ATTENTION: figure-panel is represented in JATS
  // instead there is the distinction between fig-group and fig
  // which are represented as Figure in Texture
  get tagName () { return 'fig' }

  import (el, node, importer) {
    let $$ = el.createElement.bind(el.getOwnerDocument())
    let labelEl = findChild(el, 'label')
    let contentEl = this._getContent(el)
    let permissionsEl = findChild(el, 'permissions')
    let captionEl = findChild(el, 'caption')
    let doc = importer.getDocument()
    // Preparations
    if (!captionEl) {
      captionEl = $$('caption')
    }
    let titleEl = findChild(captionEl, 'title')
    if (!titleEl) {
      titleEl = $$('title')
    }
    // drop everything than 'p' from caption
    retainChildren(captionEl, 'p')
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
    node.caption = captionEl.children.map(child => importer.convertElement(child).id)
    if (permissionsEl) {
      node.permission = importer.convertElement(permissionsEl).id
    } else {
      node.permission = doc.create({ type: 'permission' }).id
    }

    // Custom Metadata Fields
    let kwdGroupEls = el.findAll('kwd-group')
    node.metadata = kwdGroupEls.map(kwdGroupEl => {
      let kwdEls = kwdGroupEl.findAll('kwd')
      let labelEl = kwdGroupEl.find('label')
      let name = labelEl ? labelEl.textContent : ''
      let value = kwdEls.map(kwdEl => kwdEl.textContent).join(', ')
      return doc.create({
        type: 'custom-metadata-field',
        name,
        value
      }).id
    })
  }

  _getContent (el) {
    return findChild(el, 'graphic')
  }

  export (node, el, exporter) {
    let $$ = exporter.$$
    // ATTENTION: this helper retrieves the label from the state
    let label = getLabel(node)
    if (label) {
      el.append($$('label').text(label))
    }
    // Attention: <title> is part of the <caption>
    if (node.title || node.caption) {
      let content = node.resolve('caption')
      let captionEl = $$('caption')
      if (content.length > 0) {
        captionEl.append(
          content.map(p => exporter.convertNode(p))
        )
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
    // Custom Metadata Fields
    if (node.metadata.length > 0) {
      let kwdGroupEls = node.resolve('metadata').map(field => {
        let kwdGroupEl = $$('kwd-group').append(
          $$('label').text(field.name)
        )
        let kwdEls = field.value.split(',').map(str => {
          return $$('kwd').text(str.trim())
        })
        kwdGroupEl.append(kwdEls)
        return kwdGroupEl
      })
      el.append(kwdGroupEls)
    }
    if (node.content) {
      el.append(
        exporter.convertNode(node.resolve('content'))
      )
    }
    let permission = node.resolve('permission')
    if (permission && !permission.isEmpty()) {
      el.append(
        exporter.convertNode(permission)
      )
    }
  }
}
