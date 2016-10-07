export default {

  type: 'table', // Substance node model
  tagName: 'table', // Used as a matcher

  import: function(el, node) {
    node.htmlContent = el.innerHTML
  },

  export: function(node, el) {
    el.html(node.htmlContent)
  }
}
