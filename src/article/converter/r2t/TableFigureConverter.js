import { findChild } from '../util/domHelpers'
import FigurePanelConverter from './FigurePanelConverter'

export default class TableFigureConverter extends FigurePanelConverter {
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

  export (node, el, exporter) {
    const $$ = exporter.$$
    // TODO: if we decide to store attrib and permissions inside the table-wrap-foot
    // then we should not call super here, because <fig> does not have a footer
    el = super.export(node, el, exporter) || el

    if (node.hasFootnotes()) {
      // export in the same order as displayed
      let footnotes = node.getFootnoteManager().getSortedCitables()
      let tableWrapFoot = $$('table-wrap-foot').append(
        $$('fn-group').append(
          footnotes.map(fn => exporter.convertNode(fn))
        )
      )
      el.append(tableWrapFoot)
    }
  }

  _getContent (el) {
    return findChild(el, 'table')
  }
}
