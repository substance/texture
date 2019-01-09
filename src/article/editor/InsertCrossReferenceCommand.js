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
    return tx.create({
      type: 'xref',
      refType: this._getRefType(params, context)
    })
  }
}
