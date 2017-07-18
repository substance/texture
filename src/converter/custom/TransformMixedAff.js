import { isMixed } from '../util/domHelpers'

export default class Transform {

  import(dom, converter) {
    let allAffs = dom.findAll('aff')
    allAffs.forEach((aff) => {
      _importAff(aff, converter)
    })
  }

  export() {
    // nothing
  }
}

function _importAff(aff) {
  // if we find mixed content then we create an <x specific-use="display">
  if (isMixed(aff)) {
    const doc = aff.getOwnerDocument()
    let display = doc.createElement('x').attr('specific-use', 'display')
    display.append(aff.textContent)
    aff.insertAt(0, display)
  }
}
