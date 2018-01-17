import {
  extractCaptionTitle,
  wrapCaptionTitle,
  expandCaption,
  expandTitle,
  expandObjectId,
  removeLabel,
  addLabel
} from './r2tHelpers'

export default class ConvertElementCitation {

  import(dom) {
    let figs = dom.findAll('fig')
    figs.forEach((fig) => {
      removeLabel(fig)
      expandObjectId(fig, 0)
      extractCaptionTitle(fig, 1)
      expandTitle(fig, 1)
      expandCaption(fig, 2)
    })
  }

  export(dom, {doc}) {
    let figs = dom.findAll('fig')
    figs.forEach((fig) => {
      let figNode = doc.get(fig.id)
      let label = figNode.state.label
      addLabel(fig, label, 1)
      wrapCaptionTitle(fig)
    })
  }
}
