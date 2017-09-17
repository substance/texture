import { extractCaptionTitle, wrapCaptionTitle, expandCaption, expandTitle } from './r2tHelpers'
export default class ConvertElementCitation {

  import(dom) {
    let figs = dom.findAll('fig')
    figs.forEach((fig) => {
      extractCaptionTitle(fig)
      expandCaption(fig)
      expandTitle(fig)
    })
  }

  export(dom) {
    let figs = dom.findAll('fig')
    figs.forEach((fig) => {
      wrapCaptionTitle(fig)
    })
  }
}
