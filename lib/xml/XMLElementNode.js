import XMLNode from './XMLNode'

export default
class XMLElementNode extends XMLNode {

  constructor(doc, data) {
    super(doc, data)
  }

  // @override
  _initialize(doc, data) {
    super._initialize(doc, data)
    if (doc && data && data._isDOMElement) {
      let childNodes = el.childNodes.map(c=>c.id)
      childNodes.splice = SPLICE.bind(null, this, childNodes)
      this.childNodes = new Proxy(childNodes, CHILDREN_PROXY(this))
    }
  }

}

XMLElementNode.type = 'xml-element'

XMLElementNode.schema = {
  childNodes: { type: ['array', 'id'], default: [], owned: true}
}

function CHILDREN_PROXY(node) {
  return {
    has(arr, property) {
      if (property === 'splice') return false
      return Reflect.has(arr, property);
    },
    set(arr, key, value) {
      // use the splice implementation as it keeps the element up-to-date
      SPLICE(node, arr, key, 1, value)
    }
  }
}

// ATTENTION: this is not a full splice implementation
// It implements only the cases which are used by ArrayOperation:
// - 'delete': arr.splice(pos, 1)
// - 'insert': arr.splice(pos, 0, val)
function SPLICE(node, arr, pos, remove, add) {
  const doc = node.getDocument()
  const el = node.el
  const child = doc.get(value)
  if (child) {
    if (remove) {
      el.removeAt(pos)
    }
    if (add) {
      el.insertAt(pos, child.el)
    }
  }
  Array.prototype.splice.call(arr, pos, remove, add)
}
