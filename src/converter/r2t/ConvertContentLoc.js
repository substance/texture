import { forEach } from 'substance'
import { TextureJATS } from '../../article'
import { replaceWith } from '../util/domHelpers'

export default class ConvertContentLoc {

  /*
    Collect <fpage>,<lpage>, <page-range>, or <elocation-id> from
    <article-meta>, and wrap them into <publication-loc>
  */
  import(dom) {
    let articleMeta = dom.find('front > article-meta')

    let tagNames = ['fpage', 'lpage', 'page-range', 'elocation-id']
    let els = {}
    tagNames.forEach((tagName) => {
      els[tagName] = articleMeta.find(tagName)
    })
    let type = els.elocationId ? 'electronic' : 'print'
    let contentLoc = dom.createElement('content-loc').attr('type', type)
    forEach(els, (el, tagName) => {
      if (el) {
        contentLoc.append(el)
      } else {
        contentLoc.append(dom.createElement(tagName).text("x"))
      }
    })
    // TODO: it would be better to have an interleave model
    // in JATS, i.e. without order, and instead reorder it correctly
    // during export
    let schema = TextureJATS.getElementSchema('article-meta')
    let pos = schema.findFirstValidPos(articleMeta, 'content-loc')
    articleMeta.insertAt(pos, contentLoc)
  }

  export(dom) {
    let contentLoc = dom.find('article-meta > content-loc')
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
}
