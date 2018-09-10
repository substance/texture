export default {
  type: 'bold',
  tagName: 'b',
  matchElement (el) {
    return (el.is('b')) ||
      (el.is('span') && el.getStyle('font-weight') === '700')
  }
}
