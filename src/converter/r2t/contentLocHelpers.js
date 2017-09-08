import { TextureJATS } from '../../article'
import { forEach } from 'substance'
import { replaceWith } from '../util/domHelpers'

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
