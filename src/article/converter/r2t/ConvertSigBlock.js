// in TextureArticle we propose sig-block := sig+
// ATM, we are not good in editing a container like element
// that uses something else than paragraphs
// TODO: we should allow to customize the Editing behavior just for
// this element type.
// Alternatively, we could treat sig as TextProperty and somehow
// override the break behavior and insert a <break> instead
export default class ConvertSigBlock {
  import (dom) {
    dom.findAll('sig-block > sig').forEach(_importSig)
  }

  export (dom) {
    dom.findAll('sig-block > sig').forEach(_exportSig)
  }
}

function _importSig (sig) {
  let dom = sig.getOwnerDocument()
  let nodes = []
  let blocks = []

  function _createParagraph () {
    if (nodes.length > 0) {
      let p = dom.createElement('p').append(nodes)
      blocks.push(p)
      nodes = []
    }
  }

  sig.childNodes.forEach((c) => {
    if (c.tagName === 'break') {
      _createParagraph()
    } else {
      nodes.push(c)
    }
  })
  _createParagraph()

  sig.empty()
  sig.append(blocks)
}

function _exportSig (sig) {
  let dom = sig.getOwnerDocument()

  let content = []
  // now take all the <p>s the sig and separate them with <break>
  let children = sig.children
  if (children.length > 0) {
    content = content.concat(children[0].childNodes)
    for (let i = 1; i < children.length; i++) {
      content.push(dom.createElement('break'))
      content = content.concat(children[i].childNodes)
    }
  }
  sig.empty()
  sig.append(content)
}
