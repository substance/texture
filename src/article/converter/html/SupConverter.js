export default {
  type: 'sup',
  tagName: 'sup',
  matchElement (el) {
    return (el.is('sup')) || (el.is('span') && el.getStyle('vertical-align') === 'super')
  }
}
