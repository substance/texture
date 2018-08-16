import { findChild } from '../util/domHelpers'
import FigConverter from './FigConverter'

export default class TableWrapConverter extends FigConverter {
  get type () { return 'table-figure' }

  get tagName () { return 'table-wrap' }

  _getContent (el) {
    return findChild(el, 'table')
  }
}
