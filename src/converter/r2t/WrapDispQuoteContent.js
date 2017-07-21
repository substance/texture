import { unwrapChildren } from '../util/domHelpers'

export default class WrapDispQuoteContent {

  import(dom) {
    let els = dom.findAll('disp-quote')
    els.forEach((el) => {
      const children = el.children
      el.empty()
      el.append(
        dom.createElement('disp-quote-content').append(children)
      )
    })
  }

  export(dom) {
    let contentEls = dom.findAll('disp-quote-content')
    contentEls.forEach((el) => {
      unwrapChildren(el)
    })
  }
}
