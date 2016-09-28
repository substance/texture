import toDOM  from './toDOM'

/*
  Extract name from elements that contain
  name or string-name nodes (e.g. contrib, mixed-citation, element-citation)
*/
function getFullName(node) {
  var el = toDOM(node)
  var name = el.find('name')
  var stringName = el.find('string-name')

  if (name) {
    var surname = name.find('surname').text()
    var givenNames = name.find('given-names').text()
    return [givenNames, surname].join(' ')
  } else if (stringName) {
    return stringName.text()
  }
}

export default getFullName
