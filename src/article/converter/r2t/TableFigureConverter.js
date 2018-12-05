import { findChild } from '../util/domHelpers'
import FigureConverter from './FigureConverter'

export default class TableFigureConverter extends FigureConverter {
  get type () { return 'table-figure' }

  get tagName () { return 'table-wrap' }

  import (el, node, importer) {
    super.import(el, node, importer)

    const $$ = el.createElement.bind(el.getOwnerDocument())
    // table-wrap-foot is optional
    const tableWrapFoot = findChild(el, 'table-wrap-foot')
    if (tableWrapFoot) {
      // fn-group is optional
      const fnGroup = findChild(tableWrapFoot, 'fn-group')
      if (fnGroup) {
        let fnEls = fnGroup.findAll('fn')
        node.footnotes = fnEls.map(fnEl => {
          // there must be at least one paragraph
          if (!fnEl.find('p')) {
            fnEl.append($$('p'))
          }
          return importer.convertElement(fnEl).id
        })
      }
    }
  }

  _getContent (el) {
    return findChild(el, 'table')
  }
}
