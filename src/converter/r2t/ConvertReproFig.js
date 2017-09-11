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
      let reproFig = dom.createElement('repro-fig').attr('id', originalFig.id)
      reproFig.append(
        originalFig.find('caption'),
        ...convertSourceCode(originalFig, converter),
        originalFig.find('graphic')
      )
      originalFig.getParent().replaceChild(originalFig, reproFig)
    })
  }

  export(dom) {
    let reproFigs = dom.findAll('repro-fig')

    reproFigs.forEach(reproFig => {
      let fig = dom.createElement('fig')
        .attr('fig-type', 'repro-fig')
        .attr('id', reproFig.id)
      
      let alternatives = dom.createElement('alternatives')
      let sourceCode = reproFig.find('source-code')
      let output = reproFig.find('output')

      alternatives.append(
        dom.createElement('code')
          .attr('language', sourceCode.attr('language'))
          .attr('specific-use', 'source')
          .append(dom.createCDATASection(sourceCode.textContent)),
        dom.createElement('code')
          .attr('language', output.attr('language'))
          .attr('specific-use', 'output')
          .append(dom.createCDATASection(output.textContent))
      )

      fig.append(
        reproFig.find('caption'),
        alternatives,
        reproFig.find('graphic')
      )

      reproFig.getParent().replaceChild(reproFig, fig)
    })
  }
}
