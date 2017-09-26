import { importContentLoc, exportContentLoc, expandElementCitation, cleanupElementCitation } from './r2tHelpers'

export default class ConvertElementCitation {

  import(dom) {
    let elementCitations = dom.findAll('element-citation')
    elementCitations.forEach((elementCitation) => {
      importContentLoc(elementCitation)
      expandElementCitation(elementCitation, dom)
    })
  }

  export(dom) {
    let elementCitations = dom.findAll('element-citation')
    elementCitations.forEach((elementCitation) => {
      exportContentLoc(elementCitation)
      cleanupElementCitation(elementCitation)
    })
  }
}
