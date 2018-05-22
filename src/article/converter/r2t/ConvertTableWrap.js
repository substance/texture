import {
  extractCaptionTitle,
  wrapCaptionTitle,
  expandCaption,
  expandTitle,
  expandObjectId,
  removeEmptyElements,
  removeChild,
  addLabel
} from './r2tHelpers'

export default class ConvertTableWrap {

  import(dom) {
    let tableWrap = dom.findAll('table-wrap')
    tableWrap.forEach(tableWrap => {
      removeChild(tableWrap, 'label')
      expandObjectId(tableWrap, 0)
      extractCaptionTitle(tableWrap, 1)
      expandTitle(tableWrap, 1)
      expandCaption(tableWrap, 2)
    })
  }

  export(dom, {doc}) {
    let tableWrap = dom.findAll('table-wrap')
    tableWrap.forEach(tableWrap => {
      let tableWrapNode = doc.get(tableWrap.id)
      let label = tableWrapNode.state.label
      addLabel(tableWrap, label, 1)
      wrapCaptionTitle(tableWrap)
      removeEmptyElements(tableWrap, 'object-id')
    })
  }
}
