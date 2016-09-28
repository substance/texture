export default {

  type: 'unsupported',

  matchElement: function() {
    return true
  },

  import: function(el, node) {
    node.xmlContent = el.innerHTML
    node.tagName = el.tagName
  },

  export: function(node, el) {
    el.tagName = node.tagName
    el.innerHTML = node.xmlContent
    return el
  }

}
