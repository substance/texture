export default {
  type: 'strike-through',
  tagName: 's',
  matchElement (el) {
    return el.is('s') || el.is('strike') || el.getStyle('text-decoration') === 'line-through'
  },
  export (node, el) {
    el.setStyle('text-decoration', 'line-through')
  }
}
