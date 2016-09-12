export default {

  type: 'aff',
  tagName: 'aff',

  import: function(el, node, converter) { // eslint-disable-line
    node.xmlContent = el.innerHTML;
  },

  export: function(node, el, converter) { // eslint-disable-line
    el.innerHTML = node.xmlContent;
  }
}
