import convertSourceCode from './convertSourceCode'


export default class ConvertCodeCell {

  /*
    Collect <fig specific-use="repro-fig"> and turn it into repro-fig elements in
    TextureJATS

    TODO:
      - Properly handle CDATA content
      - Implement export method
  */
  import(dom, converter) {
    let reproFigs = dom.findAll('fig[fig-type=repro-fig]')

    reproFigs.forEach((originalFig) => {
      let reproFig = dom.createElement('repro-fig')
      reproFig.append(
        originalFig.find('caption'),
        ...convertSourceCode(originalFig, converter),
        originalFig.find('graphic')
      )
      originalFig.getParent().replaceChild(originalFig, reproFig)
    })
  }

  export(/*dom*/) {
    console.error('TODO: implement ConvertCodeCell.export')
  }
}
