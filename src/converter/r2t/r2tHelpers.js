import { TextureJATS } from '../../article'
import { forEach } from 'substance'
import { replaceWith, findChild } from '../util/domHelpers'

export function insertAtFirstValidPos(el, newChild) {
  let schema = TextureJATS.getElementSchema(el.tagName)
  let pos = schema.findFirstValidPos(el, newChild.tagName)
  if (pos < 0) {
    throw new Error('No valid insert position found.')
  }
  el.insertAt(pos, newChild)
}

/*
  el being <article-meta> or <element-citation>
*/
export function importContentLoc(el) {
  let dom = el.getOwnerDocument()
  let tagNames = ['fpage', 'lpage', 'page-range', 'elocation-id']
  let els = {}
  tagNames.forEach((tagName) => {
    els[tagName] = el.find(tagName)
  })
  let type = els.elocationId ? 'electronic' : 'print'
  let contentLoc = dom.createElement('content-loc').attr('type', type)
  forEach(els, (el, tagName) => {
    if (el) {
      contentLoc.append(el)
    } else {
      contentLoc.append(dom.createElement(tagName).append(""))
    }
  })

  // we need to do this so it works when strict order is enforced. For interleave
  // models we could do simply el.append(contentLoc)
  let schema = TextureJATS.getElementSchema(el.tagName)
  let pos = schema.findFirstValidPos(el, 'content-loc')
  el.insertAt(pos, contentLoc)
}

export function exportContentLoc(el) {
  let contentLoc = el.find('content-loc')
  if (contentLoc) {
    let locEls = []
    let type = contentLoc.attr('type')
    if (type === 'electronic') {
      locEls.push(contentLoc.find('elocation-id'))
    } else {
      let fpage = contentLoc.find('fpage')
      let lpage = contentLoc.find('lpage')
      let pageRange = contentLoc.find('page-range')
      if (fpage.textContent) {
        locEls.push(fpage)
        if (lpage.textContent) {
          locEls.push(lpage)
        }
      }
      if (pageRange.textContent) {
        locEls.push(pageRange)
      }
    }
    replaceWith(contentLoc, locEls)
  }
}


export function extractCaptionTitle(el, insertPos) {
  let caption = findChild(el,'caption')
  if (!caption) return
  let titleEl = findChild(caption, 'title')
  if (titleEl) {
    el.insertAt(insertPos, titleEl)
  }
}

export function wrapCaptionTitle(el) {
  let caption = findChild(el, 'caption')
  let titleEl = findChild(el, 'title')
  if (titleEl) {
    caption.insertAt(0, titleEl)
  }
}

export function expandObjectId(el, insertPos) {
  let objectId = findChild(el, 'object-id')
  if (!objectId) {
    objectId = el.createElement('object-id').attr('pub-id-type', 'doi')
    el.insertAt(insertPos, objectId)
  }
}

/*
  Adds caption to el if not yet existing
*/
export function expandCaption(el, insertPos) {
  let caption = findChild(el, 'caption')
  if (!caption) {
    caption = el.createElement('caption').append(
      el.createElement('p')
    )
    el.insertAt(insertPos, caption)
  }
}

/*
  Adds title if not present
*/
export function expandTitle(el, insertPos) {
  let title = findChild(el, 'title')
  if (!title) {
    title = el.createElement('title')
    el.insertAt(insertPos, title)
  }
}
