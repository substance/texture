export default {
  type: 'sub',
  tagName: 'sub',
  matchElement (el) {
    return (el.is('sub')) || (el.is('span') && el.getStyle('vertical-align') === 'sub')
  }
}
