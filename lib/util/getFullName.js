import toDOM from './toDOM'

/*
  Extract name from elements that contain
  name or string-name nodes (e.g. contrib, mixed-citation, element-citation)
*/
function getFullName(node) {
  let el = toDOM(node)
  let name = el.find('name')
  let stringName = el.find('string-name')

  if (name) {
    let surname = name.find('surname').text()
    let givenNames = name.find('given-names').text()
    return [givenNames, surname].join(' ')
  } else if (stringName) {
    return stringName.text()
  }
}

export default getFullName
