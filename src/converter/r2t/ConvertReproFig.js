import {
  importSourceCode, exportSourceCode, importOutput, exportOutput,
  extractCaptionTitle, expandCaption, expandTitle, expandObjectId
} from './r2tHelpers'

export default class ConvertReproFig {

  /*
    Collect <fig specific-use="repro-fig"> and turn it into repro-fig elements in
    TextureJATS
  */
  import(dom) {
    let reproFigs = dom.findAll('fig[fig-type=repro-fig]')
    reproFigs.forEach((reproFig) => {
      let source = reproFig.find('code[specific-use=source]')
      let output = reproFig.find('code[specific-use=output]')
      reproFig.tagName = 'repro-fig'
      let cellEl = dom.createElement('cell').append(
        importSourceCode(source),
        importOutput(output)
      )
      let alternatives = reproFig.find('alternatives')
      reproFig.removeChild(alternatives)
      reproFig.append(
        expandObjectId(reproFig, 0),
        extractCaptionTitle(reproFig, 1),
        expandTitle(reproFig, 1),
        expandCaption(reproFig, 2),
        cellEl
      )
    })
  }

  export(/*dom*/) {
    throw new Error('Revise implementation')
    // let reproFigs = dom.findAll('repro-fig')
    // let $$ = dom.createElement.bind(dom)
    // reproFigs.forEach((reproFig) => {
    //   let source = reproFig.find('source-code')
    //   let output = reproFig.find('output')
    //   reproFig.tagName = 'fig'
    //   reproFig.empty()
    //   reproFig.attr('fig-type', 'repro-fig')
    //   reproFig.append(
    //     $$('alternatives').append(
    //       exportSourceCode(source),
    //       exportOutput(output)
    //     )
    //   )
    // })
  }

}
