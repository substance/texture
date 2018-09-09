export function importPermissions (el, node, importer) {
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

export function exportPermissions (node, el, exporter) {
  let $$ = exporter.$$
  if (_hasPermissions(node)) {
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

function _hasPermissions (node) {
  return node.copyrightStatement || node.copyrightYear || node.copyrightHolder || node.license || node.licenseText
}
