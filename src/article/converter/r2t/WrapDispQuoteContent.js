import { unwrapChildren } from '../util/domHelpers'

export default class WrapDispQuoteContent {

  import(dom) {
    dom.findAll('disp-quote').forEach((dispQuote) => {
      let attrib = dispQuote.find('attrib')
      // Pull off <attrib> element or create empty element
      if (attrib) {
        dispQuote.removeChild(attrib)
      } else {
        attrib = dom.createElement('attrib')
      }
      let content = dom.createElement('disp-quote-content').append(dispQuote.children)
      dispQuote.append(content)
      dispQuote.append(attrib)
    })
  }

  export(dom) {
    dom.findAll('disp-quote-content').forEach(unwrapChildren)
    let dispQuotes = dom.findAll('disp-quote')
    // Remove all empty attrib elements
    dispQuotes.forEach((dispQuote) => {
      let attrib = dispQuote.find('attrib')
      if (attrib.textContent === '') {
        dispQuote.removeChild(attrib)
      }
    })
  }
}
