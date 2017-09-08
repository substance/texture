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
      let cell = dom.createElement('cell')

      cell.append(
        convertSourceCode(oldCell, converter)
      )
      oldCell.getParent().replaceChild(oldCell, cell)
    })
  }

  export(/*dom*/) {
    console.error('TODO: implement ConvertCodeCell.export')
  }
}
