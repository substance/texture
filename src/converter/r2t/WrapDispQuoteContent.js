import { unwrapChildren } from '../util/domHelpers'

export default class WrapDispQuoteContent {

  import(dom) {
    dom.findAll('disp-quote').forEach((dispQuote) => {
      let attribs = dispQuote.findAll('attrib')
      let content = dom.createElement('disp-quote-content').append(dispQuote.children)
      dispQuote.append(content)
      dispQuote.append(attribs)
    })
  }

  export(dom) {
    dom.findAll('disp-quote-content').forEach(unwrapChildren)
  }
}
