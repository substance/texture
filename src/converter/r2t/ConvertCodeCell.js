import convertSourceCode from './convertSourceCode'

export default class ConvertCodeCell {

  /*
    Collect <code specific-use="cell"> and turn it into cell elements in
    TextureJATS

    TODO:
      - Properly handle CDATA content
      - Implement export method
  */
  import(dom, converter) {
    let cells = dom.findAll('code[specific-use=cell]')

    cells.forEach((oldCell) => {
      let cell = dom.createElement('cell').attr('id', oldCell.id)

      cell.append(
        convertSourceCode(oldCell, converter)
      )
      oldCell.getParent().replaceChild(oldCell, cell)
    })
  }

  export(dom) {
    let cells = dom.findAll('cell')

    cells.forEach(cell => {
      let code = dom.createElement('code')
        .attr('specific-use', 'cell')
        .attr('id', cell .id)
      let alternatives = dom.createElement('alternatives')
      let sourceCode = cell.find('source-code')
      let output = cell.find('output')
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

      code.append(
        dom.createElement('named-content').append(alternatives)
      )

      cell.getParent().replaceChild(cell, code)
    })
  }
}
