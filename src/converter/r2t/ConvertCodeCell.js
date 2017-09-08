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
      let miniSource = oldCell.find('code[language=mini]')
      let nativeSource = oldCell.find('code:not([language=mini])')
      let output = oldCell.find('code[specific-use=output]')
      let miniSourceText

      if (miniSource) {
        miniSourceText = miniSource.textContent
      } else if (nativeSource) {
        // We make up mini source string if not present
        miniSourceText = nativeSource.attr('language')+'()'
      } else {
        converter.error({
          msg: 'Either code[lanuage=mini] or code:not([language=mini]) must be provided',
          el: oldCell
        })
      }
      cell.append(
        dom.createElement('source-code').attr('language', 'mini').append(
          miniSourceText
        )
      )

      if (nativeSource) {
        dom.createElement('source-code').attr('language', nativeSource.attr('language')).append(
          nativeSource.textContent
        )
      }
      cell.append(
        dom.createElement('output').append(output.textContent)
      )
      oldCell.getParent().replaceChild(oldCell, cell)
    })
  }

  export(/*dom*/) {
    console.error('TODO: implement ConvertCodeCell.export')
  }
}
