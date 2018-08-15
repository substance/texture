import InternalArticleSchema from '../../InternalArticleSchema'
import { REQUIRED_ELEMENT_CITATION_ELEMENTS } from '../../ArticleConstants'
import { findChild, findAllChildren } from '../util/domHelpers'

export function expandElementCitation (el, doc) {
  REQUIRED_ELEMENT_CITATION_ELEMENTS.forEach((element) => {
    let [ tagName, attrib, attribVal ] = element
    let matcher = tagName
    if (attrib) {
      matcher = `${tagName}[${attrib}=${attribVal}]`
    }
    let childEl = el.find(matcher)
    if (!childEl) {
      childEl = doc.createElement(tagName)
      if (attrib) {
        childEl.attr(attrib, attribVal)
      }
      el.append(childEl)
    }
  })
}

// TODO: can we make this more robust?
export function cleanupElementCitation (el) {
  REQUIRED_ELEMENT_CITATION_ELEMENTS.forEach((tagName) => {
    let childEl = findChild(el, tagName)
    if (childEl.textContent === '' && childEl.children.length === 0) {
      el.removeChild(childEl)
    }
  })
}

export function extractCaptionTitle (el, insertPos) {
  let caption = findChild(el, 'caption')
  if (!caption) return
  let titleEl = findChild(caption, 'title')
  if (titleEl) {
    el.insertAt(insertPos, titleEl)
  }
}

export function wrapCaptionTitle (el) {
  let caption = findChild(el, 'caption')
  let titleEl = findChild(el, 'title')
  if (titleEl) {
    caption.insertAt(0, titleEl)
  }
}

export function expandObjectId (el, insertPos) {
  let objectId = findChild(el, 'object-id')
  if (!objectId) {
    objectId = el.createElement('object-id').attr('pub-id-type', 'doi')
    el.insertAt(insertPos, objectId)
  }
}

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

/*
  Adds caption to el if not yet existing
*/
export function expandCaption (el, insertPos) {
  let caption = findChild(el, 'caption')
  if (!caption) {
    caption = el.createElement('caption').append(
      el.createElement('p')
    )
    el.insertAt(insertPos, caption)
  } else {
    // Create an empty p element if not there
    let p = caption.find('p')
    if (!p) {
      caption.append(el.createElement('p'))
    }
  }
}

/*
  Adds title if not present
*/
export function expandTitle (el, insertPos) {
  let title = findChild(el, 'title')
  if (!title) {
    title = el.createElement('title')
    el.insertAt(insertPos, title)
  }
}

export function removeChild (el, cssSelector) {
  let childEl = findChild(el, cssSelector)
  if (childEl) {
    el.removeChild(childEl)
  }
}

export function importSourceCode (el) {
  return el.createElement('source-code')
    .attr('language', el.attr('language'))
    .text(el.text())
}

export function exportSourceCode (el) {
  return el.createElement('code')
    .attr('specific-use', 'source')
    .attr('language', el.attr('language'))
    .append(
      el.createCDATASection(el.textContent)
    )
}

export function importOutput (el) {
  return el.createElement('output')
    .attr('language', el.attr('language'))
    .text(el.text())
}

export function exportOutput (el, newValue) {
  // NOTE: If no new value is provided we use the old cached value
  if (newValue) {
    newValue = JSON.stringify(newValue)
  } else {
    newValue = el.textContent
  }
  return el.createElement('code')
    .attr('specific-use', 'output')
    .attr('language', el.attr('language'))
    .append(
      el.createCDATASection(newValue)
    )
}

/*
  Expands contribGroup if it does not exist
*/
export function expandContribGroup (dom, type) {
  let articleMeta = dom.find('article-meta')
  let contribGroup = dom.find(`contrib-group[content-type=${type}]`)
  if (!contribGroup) {
    contribGroup = dom.createElement('contrib-group').attr('content-type', type)
    insertChildAtFirstValidPos(articleMeta, contribGroup)
  }
}

export function expandAbstract (dom) {
  let articleMeta = dom.find('article-meta')
  let abstract = articleMeta.find('abstract')
  if (!abstract) {
    abstract = dom.createElement('abstract')
    insertChildAtFirstValidPos(articleMeta, abstract)
  }
}

/*
  Takes a selector and delets all matching elements if they have no children
*/
export function removeEmptyElementsIfNoChildren (dom, selector) {
  let elements = dom.findAll(selector)
  elements.forEach(el => {
    if (el.children.length === 0) {
      let parent = el.getParent()
      parent.removeChild(el)
    }
  })
}

export function insertChildAtFirstValidPos (parent, child) {
  let schema = InternalArticleSchema.getElementSchema(parent.tagName)
  let insertPos = schema.findFirstValidPos(parent, child.tagName)
  if (insertPos >= 0) {
    parent.insertAt(insertPos, child)
  } else {
    throw new Error(`No valid insert position found for ${child.tagName} in ${parent.tagName}`)
  }
}

// NOTE: Last param is there because we have no way to ask the schema for
// insert pos of multiple elements e.g. (fpage, lpage)?
export function insertChildrenAtFirstValidPos (parent, children, tagName) {
  let schema = InternalArticleSchema.getElementSchema(parent.tagName)
  let insertPos = schema.findFirstValidPos(parent, tagName)
  if (insertPos >= 0) {
    children.forEach((child, index) => {
      parent.insertAt(insertPos + index, child)
    })
  } else {
    throw new Error(`No valid insert position found for ${tagName} in ${parent.tagName}`)
  }
}

export function getFirstValidInsertPos (parent, tagName) {
  let schema = InternalArticleSchema.getElementSchema(tagName)
  return schema.findFirstValidPos(parent, tagName)
}

/*
  Remove elements based on an array of matchers
*/
export function removeElements (rootEl, matchers) {
  matchers.forEach(matcher => {
    let elements = rootEl.findAll(matcher)
    elements.forEach(element => {
      element.getParent().removeChild(element)
    })
  })
}
