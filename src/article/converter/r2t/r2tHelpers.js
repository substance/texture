import { findChild, findAllChildren } from '../util/domHelpers'

export function removeEmptyElements (el, tagName) {
  let childs = findAllChildren(el, tagName)
  childs.forEach(child => {
    if (child.textContent === '') {
      el.removeChild(child)
    }
  })
}

export function addLabel (el, labelText, insertPos) {
  let label = el.createElement('label').text(labelText)
  el.insertAt(insertPos, label)
}

export function removeChild (el, cssSelector) {
  let childEl = findChild(el, cssSelector)
  if (childEl) {
    el.removeChild(childEl)
  }
}

// export function importSourceCode (el) {
//   return el.createElement('source-code')
//     .attr('language', el.attr('language'))
//     .text(el.text())
// }

// export function exportSourceCode (el) {
//   return el.createElement('code')
//     .attr('specific-use', 'source')
//     .attr('language', el.attr('language'))
//     .append(
//       el.createCDATASection(el.textContent)
//     )
// }

// export function importOutput (el) {
//   return el.createElement('output')
//     .attr('language', el.attr('language'))
//     .text(el.text())
// }

// export function exportOutput (el, newValue) {
//   // NOTE: If no new value is provided we use the old cached value
//   if (newValue) {
//     newValue = JSON.stringify(newValue)
//   } else {
//     newValue = el.textContent
//   }
//   return el.createElement('code')
//     .attr('specific-use', 'output')
//     .attr('language', el.attr('language'))
//     .append(
//       el.createCDATASection(newValue)
//     )
// }

/*
  Takes a selector and delets all matching elements if they have no children
*/
// export function removeEmptyElementsIfNoChildren (dom, selector) {
//   let elements = dom.findAll(selector)
//   elements.forEach(el => {
//     if (el.children.length === 0) {
//       let parent = el.getParent()
//       parent.removeChild(el)
//     }
//   })
// }
