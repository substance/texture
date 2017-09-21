import { importSourceCode, exportSourceCode, importOutput, exportOutput } from './r2tHelpers'

export default class ConvertCodeCell {

  /*
    Collect <code specific-use="cell"> and turn it into cell elements in
    TextureJATS
  */
  import(dom) {
    let cells = dom.findAll('code[specific-use=cell]')

    cells.forEach((cell) => {
      let source = cell.find('code[specific-use=source]')
      let output = cell.find('code[specific-use=output]')
      cell.tagName = 'cell'
      cell.empty()
      cell.append(
        importSourceCode(source),
        importOutput(output)
      )
    })
  }


  export(dom) {
    let cells = dom.findAll('cell')
    let $$ = dom.createElement.bind(dom)
    cells.forEach((cell) => {
      let source = cell.find('source-code')
      let output = cell.find('output')
      cell.tagName = 'code'
      cell.empty()
      cell.attr('specific-use', 'cell')
      cell.append(
        $$('named-content').append(
          $$('alternatives').append(
            exportSourceCode(source),
            exportOutput(output)
          )
        )
      )
    })
  }
}
