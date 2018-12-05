import InsertXrefCommand from './InsertXrefCommand'

export default class InsertFootnoteCrossReferenceCommand extends InsertXrefCommand {
  getCommandState (params, context) {
    let sel = params.selection
    let scope = this.detectScope(params, context)
    let newState = {
      disabled: this.isDisabled(params, scope),
      active: false,
      showInContext: this.showInContext(sel, params, context),
      scope: scope
    }
    return newState
  }

  detectScope (params, context) {
    const xpath = params.selectionState.xpath
    return xpath.indexOf('table-figure') > -1 ? 'table-figure' : undefined
  }

  isDisabled (params, currentScope) {
    const sel = params.selection
    const scope = this.config.scope

    if (!sel.isPropertySelection() || !sel.isCollapsed() || scope !== currentScope) {
      return true
    }
    return false
  }
}
