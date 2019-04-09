export default class PermissionsConverter {
  get type () { return 'permission' }

  get tagName () { return 'permissions' }

  import (el, node, importer) {
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

  export (node, el, exporter) {
    let $$ = exporter.$$
    if (node.copyrightStatement) {
      el.append($$('copyright-statement').append(node.copyrightStatement))
    }
    if (node.copyrightYear) {
      el.append($$('copyright-year').append(node.copyrightYear))
    }
    if (node.copyrightHolder) {
      el.append($$('copyright-holder').append(node.copyrightHolder))
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
      el.append(licenseEl)
    }
  }
}
