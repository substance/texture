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
    // EXPERIMENTAL: supporting <supplementary-material> in figure caption
    // in JATS this requires a HACK, wrapping <supplementary-material> into a <p>
    // this implementation is prototypal, i.e. has not been signed off commonly
    this._unwrapDisplayElements(captionEl)

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
    // Note: we are transforming capton content to legend property
    node.legend = captionEl.children.map(child => importer.convertElement(child).id)
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
      let values = kwdEls.map(kwdEl => kwdEl.textContent)
      return doc.create({
        type: 'custom-metadata-field',
        name,
        values
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
    // Note: we are transforming the content of legend to <caption>
    if (node.title || node.legend) {
      let content = node.resolve('legend')
      let captionEl = $$('caption')
      if (content.length > 0) {
        captionEl.append(
          content.map(p => exporter.convertNode(p))
        )
      }
      if (node.title) {
        // Note: this would happen if title is set, but no caption
        if (!captionEl) captionEl = $$('caption')
        // ATTENTION: wrapping display elements into a <p>
        // Do this before injecting the title
        this._wrapDisplayElements(captionEl)
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
        let kwdEls = field.values.map(str => {
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

  // EXPERIMENTAL see comment above
  _unwrapDisplayElements (el) {
    let children = el.getChildren()
    let L = children.length
    for (let i = L - 1; i >= 0; i--) {
      let child = children[i]
      if (child.is('p[specific-use="display-element-wrapper"]')) {
        let children = child.getChildren()
        if (children.length === 1) {
          el.replaceChild(child, children[0])
        } else {
          console.error('Expecting a single element wrapped in <p>')
        }
      }
    }
  }

  _wrapDisplayElements (el) {
    let children = el.getChildren()
    let L = children.length
    for (let i = L - 1; i >= 0; i--) {
      let child = children[i]
      if (!child.is('p')) {
        let p = el.createElement('p').attr('specific-use', 'display-element-wrapper').append(child.clone(true))
        el.replaceChild(child, p)
      }
    }
  }
}
