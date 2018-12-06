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

  _getRefType () {
    return this.config.refType
  }

  _createNode (tx) {
    const refType = this._getRefType()
    let xref = tx.createElement('xref')
    xref.attr('ref-type', refType)
    xref.attr('rid', '')
    return xref
  }
}
