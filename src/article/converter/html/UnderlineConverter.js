export default {
  type: 'underline',
  tagName: 'span',
  matchElement (el) {
    return el.getStyle('text-decoration') === 'underline'
  },
  export (node, el) {
    el.setStyle('text-decoration', 'underline')
  }
}
