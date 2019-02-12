export default {
  type: 'underline',
  tagName: 'u',
  matchElement (el) {
    return el.is('u') || el.getStyle('text-decoration') === 'underline'
  },
  export (node, el) {
    el.setStyle('text-decoration', 'underline')
  }
}
