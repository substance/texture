export default {

  type: 'unsupported',

  matchElement: function() {
    return true
  },

  import: function(el, node) {
    node.xml = el.outerHTML
    node.tagName = el.tagName
  },

  export: function(node, el) {
    el.innerHTML = node.xml
    return el.children[0]
  }

}
