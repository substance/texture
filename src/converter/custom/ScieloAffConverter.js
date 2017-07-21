export default class ScieloAffConverter {

  import(dom, converter) {
    let allAffs = dom.findAll('aff')
    allAffs.forEach((aff) => {
      _importAff(aff, converter)
    })
  }

  export(dom) {
    let affs = dom.findAll('aff')
    affs.forEach((aff) => {
      _exportAff(aff)
    })
  }
}

/*
  SciELO uses institution[content-type="original"] to retain
  a textual representation.
*/
function _importAff(aff) {
  const doc = aff.getOwnerDocument()
  ;['original', 'normalized'].forEach((type) => {
    let el = aff.find(`institution[content-type=${type}]`)
    if (el) {
      aff.removeChild(el)
      let display = doc.createElement('x').attr('specific-use', type)
      display.append(el.childNodes)
      aff.insertAt(0, display)
    }
  })
}

function _exportAff(aff) {
  const doc = aff.getOwnerDocument()
  let original = aff.find(`x[specific-use=original]`)
  if (original) {
    original.removeAttr('specific-use').setTagName('institution').attr('content-type', 'original')
  }
  let normalized = aff.find(`x[specific-use=normalized]`)
  if (normalized) {
    // TODO: we should generate these, as they should be derived
    // from the structured data
    aff.removeChild(normalized)
    let el = doc.createElement('institution').attr('content-type', 'normalized')
    el.textContent = _normalizedInstitution(aff)
    aff.insertAt(0, el)
  }
  // let display = aff.find(`x[specific-use=normalized]`)
}

function _normalizedInstitution(/*aff*/) {
  return '_normalizedInstitution not implemented'
}
