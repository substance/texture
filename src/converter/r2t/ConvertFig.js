import { extractCaptionTitle, wrapCaptionTitle, expandCaption, expandTitle, expandObjectId } from './r2tHelpers'
export default class ConvertElementCitation {

  import(dom) {
    let figs = dom.findAll('fig')
    figs.forEach((fig) => {
      expandObjectId(fig, 0)
      extractCaptionTitle(fig, 1)
      expandTitle(fig, 1)
      expandCaption(fig, 2)
    })
  }

  export(dom) {
    let figs = dom.findAll('fig')
    figs.forEach((fig) => {
      wrapCaptionTitle(fig)
    })
  }
}
