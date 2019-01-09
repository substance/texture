export default {
  type: 'subscript',
  tagName: 'sub',
  matchElement (el) {
    return (el.is('sub')) || (el.is('span') && el.getStyle('vertical-align') === 'sub')
  }
}
