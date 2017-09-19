import { extractCaptionTitle, wrapCaptionTitle, expandCaption, expandTitle, expandObjectId } from './r2tHelpers'
export default class ConvertElementCitation {

  import(dom) {
    let tableWrap = dom.findAll('table-wrap')
    tableWrap.forEach((tableWrap) => {
      expandObjectId(tableWrap, 0)
      extractCaptionTitle(tableWrap, 1)
      expandTitle(tableWrap, 1)
      expandCaption(tableWrap, 2)
    })
  }

  export(dom) {
    let tableWrap = dom.findAll('table-wrap')
    tableWrap.forEach((tableWrap) => {
      wrapCaptionTitle(tableWrap)
    })
  }
}
