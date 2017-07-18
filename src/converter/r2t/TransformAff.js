export default class TransformAff {

  import(dom) {
    let allAffs = dom.findAll('aff')
    allAffs.forEach((aff) => {
      _importAff(aff)
    })
  }

  export(dom) {
    let allAffs = dom.findAll('aff')
    allAffs.forEach((aff) => {
      _exportAff(aff)
    })
  }
}

function _importAff(aff) {
  const doc = aff.getOwnerDocument()
  let x = aff.find('x[specific-use=display]')
  let stringAff = doc.createElement('string-aff')
  let elementAff = doc.createElement('element-aff')
  if (x) {
    stringAff.append(x.childNodes)
    aff.removeChild(x)
  }
  elementAff.append(aff.children)
  aff.append(stringAff, elementAff)
}

function _exportAff(aff) {
  const doc = aff.getOwnerDocument()
  let stringAff = aff.find('string-aff')
  let elementAff = aff.find('element-aff')
  aff.empty()
  if (stringAff) {
    let x = doc.createElement('x').attr('specific-use', 'display')
    x.append(stringAff.childNodes)
    aff.append(x)
  }
  if (elementAff) {
    aff.append(elementAff.children)
  }
}
