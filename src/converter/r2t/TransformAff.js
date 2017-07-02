import { unwrapChildren } from '../util/domHelpers'

export default class TransformAff {

  import(dom, converter) {
    let allAffs = dom.findAll('aff')
    allAffs.forEach((aff) => {
      _importAff(aff, converter)
    })
  }

  export(dom) {
    let affGroup = dom.find('aff-group')
    let affs=affGroup.findAll('aff')
    affs.forEach((aff) => {
      _exportAff(aff)
    })
    unwrapChildren(affGroup)
  }
}

function _importAff(aff, converter) {
  // following the Scielo spec there should be
  // an 'institution[content-type="original"]'
  // which contains the pure textual form (as created by the author)
  const doc = aff.getOwnerDocument()
  let original = aff.find('institution[content-type="original"]')
  if (!original) {
    converter.error({
      msg: 'Could not find textual representation of <aff>.',
      el: aff
    })
  }
  let stringAff = doc.createElement('string-aff')
  if (original) {
    aff.removeChild(original)
    stringAff.append(original.childNodes)
  }
  let elementAff = doc.createElement('element-aff')
  elementAff.append(aff.children)
  aff.append(stringAff, elementAff)
}

function _exportAff(aff) {
  const doc = aff.getOwnerDocument()
  let stringAff = aff.find('string-aff')
  if (stringAff) {
    let institutionEl = doc.createElement('institution')
    institutionEl.attr('content-type', 'original')
    institutionEl.append(stringAff.childNodes)
    aff.replaceChild(stringAff, institutionEl)
  }
  let elementAff = aff.find('element-aff')
  if (elementAff) {
    unwrapChildren(elementAff)
    aff.removeChild(elementAff)
  }
}