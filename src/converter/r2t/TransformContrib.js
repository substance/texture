export default class TransformContrib {

  import(dom) {
    let allContribs = dom.findAll('contrib')
    allContribs.forEach((contrib) => {
      _importContrib(contrib)
    })
  }

  export(dom) {
    let allContribs = dom.findAll('contrib')
    allContribs.forEach((contrib) => {
      _exportContrib(contrib)
    })
  }
}

function _importContrib(contrib) {
  const doc = contrib.getOwnerDocument()
  let x = contrib.find('x[specific-use=display]')
  let stringContrib = doc.createElement('string-contrib')
  let elementContrib = doc.createElement('element-contrib')
  if (x) {
    stringContrib.append(x.childNodes)
    contrib.removeChild(x)
  } else {
    // TODO: a proper renderer would be nice here
    let name = contrib.find('name')
    if (name) {
      let givenNames = name.find('given-names')
      let surname = name.find('surname')
      if (givenNames && surname) {
        stringContrib.textContent = givenNames.textContent + " " + surname.textContent
      } else {
        stringContrib.textContent = name.textContent
      }
    } else {
      stringContrib.textContent = contrib.textContent
    }
  }
  elementContrib.append(contrib.children)
  contrib.append(stringContrib, elementContrib)
}

function _exportContrib(contrib) {
  const doc = contrib.getOwnerDocument()
  let stringContrib = contrib.find('string-contrib')
  let elementContrib = contrib.find('element-contrib')
  contrib.empty()
  if (stringContrib) {
    let x = doc.createElement('x').attr('specific-use', 'display')
    x.append(stringContrib.childNodes)
    contrib.append(x)
  }
  if (elementContrib) {
    contrib.append(elementContrib.children)
  }
}
