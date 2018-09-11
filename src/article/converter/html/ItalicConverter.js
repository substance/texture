export default {
  type: 'italic',
  tagName: 'i',
  matchElement (el) {
    return (el.is('i')) ||
      (el.is('span') && el.getStyle('font-style') === 'italic')
  }
}
