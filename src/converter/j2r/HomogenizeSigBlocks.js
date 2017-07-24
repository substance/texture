/*
  <sig-block> must contain <sig> elements, and must not contain content directly
*/
export default class HomogenizeSigBlocks {

  import(dom) {
    let sigBlocks = dom.findAll('sig-block')
    sigBlocks.forEach(_homogenizeSigBlock)
  }

}

function _homogenizeSigBlock(sigBlock) {
  const doc = sigBlock.getOwnerDocument()
  // don't allow content outside of <sig> element
  let sigContent = []
  let children = []
  sigBlock.childNodes.forEach((child) => {
    if (child.isElementNode()) {
      if (child.tagName === 'sig') {
        _addSig()
        children.push(child)
      }
    } else if (child.isTextNode()) {
      sigContent.push(child)
    } else {
      children.push(child)
    }
  })
  _addSig()

  sigBlock.empty()
  sigBlock.append(children)

  function _addSig() {
    if (sigContent.length > 0) {
      let sig = doc.createElement('sig')
      sig.append(sigContent)
      sigContent = []
      children.push(sig)
    }
  }

}