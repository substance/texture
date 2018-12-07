import InsertInlineNodeCommand from './InsertInlineNodeCommand'

export default class InsertCrossReferenceCommand extends InsertInlineNodeCommand {
  getType () {
    return 'xref'
  }

  isDisabled (params, context) {
    // cross-references should only be inserted with collapsed selection
    const sel = params.selection
    return (super.isDisabled(params, context) || !sel.isCollapsed())
  }

  _getRefType (params, context) { // eslint-disable-line
    return this.config.refType
  }

  _createNode (tx, params, context) {
    const refType = this._getRefType(params, context)
    let xref = tx.createElement('xref')
    xref.attr('ref-type', refType)
    xref.attr('rid', '')
    return xref
  }
}
