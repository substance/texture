import { findChild } from '../util/domHelpers'
import FigConverter from './FigConverter'

export default class TableWrapConverter extends FigConverter {
  get type () { return 'table-figure' }

  get tagName () { return 'table-wrap' }

  import (el, node, importer) {
    super.import(el, node, importer)
    let $$ = el.createElement.bind(el.getOwnerDocument())
    const TableWrapFoot = findChild(el, 'table-wrap-foot')
    const FnGroup = findChild(TableWrapFoot, 'fn-group')
    node.footnotes = []
    let fnEls = FnGroup.findAll('fn')
    node.footnotes = fnEls.map(fnEl => {
      // there must be at least one paragraph
      if (!fnEl.find('p')) {
        fnEl.append($$('p'))
      }
      return importer.convertElement(fnEl).id
    })
  }

  _getContent (el) {
    return findChild(el, 'table')
  }
}
