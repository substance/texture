/*
  This pulls block-elements such as `<fig>` which are
  wrapped in a `<p>` one level up.
  In the opposite direction only those elements are wrapped
  which would otherwise violate JATS
*/
export default class UnwrapBlockLevelElements {
  import (dom) {
    dom.findAll('body > p').forEach(_pBlock)
  }

  export () {}
}

// TODO: add all of them
const BLOCKS = ['fig', 'fig-group', 'media', 'list', 'disp-formula', 'disp-quote']
const isBlock = BLOCKS.reduce((m, n) => { m[n] = true; return m }, {})

function _pBlock (p) {
  let parent = p.parentNode
  let children = p.children
  let L = children.length
  let hasChanged = false
  // doing it reverse so that we don't miss elements due to the ongoing tranformations
  for (var i = L - 1; i >= 0; i--) {
    let child = children[i]
    if (isBlock[child.tagName]) {
      hasChanged = true
      // create a new <p>
      let newP = parent.createElement('p')
      let childPos = p.getChildIndex(child)
      let siblings = p.childNodes.slice(childPos + 1)
      // move all subsequent siblings to the new <p>
      // and insert the block element and the new one after the current <p>
      let pos = parent.getChildIndex(p) + 1
      parent.insertAt(pos, child)
      if (siblings.length > 0 && !_isEmpty(siblings)) {
        newP.append(siblings)
        parent.insertAt(pos + 1, newP)
      }
    }
  }
  // if the original <p> is now empty, remove it
  if (hasChanged && _isEmpty(p.childNodes)) {
    p.parentNode.removeChild(p)
  }
}

function _isEmpty (nodes) {
  for (let i = 0; i < nodes.length; i++) {
    let child = nodes[i]
    if (!child.isTextNode() || !(/^\s*$/.exec(child.textContent))) return false
  }
  return true
}
