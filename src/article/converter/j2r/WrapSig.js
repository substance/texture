import { isMixed } from '../util/domHelpers'

export default class WrapSig {
  import (dom, api) {
    dom.findAll('sig-block').forEach((sigBlock) => {
      _importSigBlock(sigBlock, api)
    })
  }

  export () {
    // nothing
  }
}

function _importSigBlock (sigBlock, api) {
  let dom = sigBlock.getOwnerDocument()
  let sig = sigBlock.find('sig')

  if (isMixed(sigBlock)) {
    if (sig) {
      api.error({
        msg: 'Found <sig-block> containing <sig> elements but also text. Please wrap all content in <sig>.'
      })
    } else {
      let sig = dom.createElement('sig')
      sig.append(sigBlock.childNodes)
      sigBlock.append(sig)
    }
  }
}
