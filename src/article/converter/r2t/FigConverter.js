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

    // Preparations
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

    // Extract figure permissions
    let copyrightStatementEl = el.find('copyright-statement')
    if (copyrightStatementEl) {
      node.copyrightStatement = copyrightStatementEl.textContent
    }
    let copyrightYearEl = el.find('copyright-year')
    if (copyrightYearEl) {
      node.copyrightYear = copyrightYearEl.textContent
    }
    let copyrightHolderEl = el.find('copyright-holder')
    if (copyrightHolderEl) {
      node.copyrightHolder = copyrightHolderEl.textContent
    }

    // TODO: it would be more natural and explicit to do el.find('ali:license-rec')
    let licenseRefEl = el.find('license_ref')
    if (licenseRefEl) {
      node.license = licenseRefEl.textContent
    }
    let licenseP = el.find('license > license-p')
    if (licenseP) {
      node.licenseText = importer.annotatedText(licenseP, [node.id, 'licenseText'])
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

    if (this._hasPermissions(node)) {
      let permissionsEl = $$('permissions')
      if (node.copyrightStatement) {
        permissionsEl.append($$('copyright-statement').append(node.copyrightStatement))
      }
      if (node.copyrightYear) {
        permissionsEl.append($$('copyright-year').append(node.copyrightYear))
      }
      if (node.copyrightHolder) {
        permissionsEl.append($$('copyright-holder').append(node.copyrightHolder))
      }

      if (node.license || node.licenseText) {
        let licenseEl = $$('license')
        if (node.license) {
          licenseEl.append(
            $$('ali:license_ref').append(node.license)
          )
        }
        if (node.licenseText) {
          licenseEl.append(
            $$('license-p').append(
              exporter.annotatedText([node.id, 'licenseText'])
            )
          )
        }
        permissionsEl.append(licenseEl)
      }
      el.append(permissionsEl)
    }
  }

  _hasPermissions (node) {
    return node.copyrightStatement || node.copyrightYear || node.copyrightHolder || node.license || node.licenseText
  }
}
