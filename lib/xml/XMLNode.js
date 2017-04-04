import { DocumentNode, uuid } from 'substance'

const SIGNATURE = uuid('_XMLNode')

export default
class XMLNode extends DocumentNode {

  constructor(doc, data) {
    super(doc, data)
  }

  // @override
  _initialize(doc, data) {
    super._initialize(doc, data)

    let el = doc.el.createElement(data.type)
    el[SIGNATURE] = this
    this.el = el
    this.attributes = new Proxy(this, ATTRIBUTES_PROXY)
  }

}

XMLNode.type = 'xml-node'

XMLNode.schema = {
  attributes: { type: 'object', default: {} }
}

const ATTRIBUTES_PROXY = {

  has (node, key) {
    return node.el.hasAttribute(key)
  },

  ownKeys(node) {
    return node.el.getAttributes().keys()
  },

  get (node, key) {
    return node.el.getAttribute(key)
  },

  set (node, key, value) {
    node.el.setAttribute(key, value)
  }

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