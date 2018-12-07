import { orderBy, includes, without } from 'substance'
import { findParentByType } from './nodeHelpers'

// left side: node type
// right side: ref-type
export const REF_TYPES = {
  'disp-formula': 'formula',
  'figure': 'fig',
  'repro-fig': 'fig',
  'fig-group': 'fig',
  'fn': 'fn',
  'ref': 'bibr',
  'table-figure': 'table',
  'table-wrap-group': 'table'
}

// TODO: how could this be configured?
const RefTypeToManager = {
  'bibr': 'referenceManager',
  'formula': 'formulaManager',
  'fig': 'figureManager',
  'table': 'tableManager',
  'fn': 'footnoteManager'
}

// left side: ref-type
// right side: [... node types]
export const XREF_TARGET_TYPES = Object.keys(REF_TYPES).reduce((m, type) => {
  const refType = REF_TYPES[type]
  if (!m[refType]) m[refType] = []
  m[refType].push(type)
  return m
}, {
  'table-fn': ['fn']
})

export function getXrefTargets (xref) {
  let idrefs = xref.getAttribute('rid')
  if (idrefs) {
    return idrefs.split(' ')
  } else {
    return []
  }
}

export function getXrefLabel (xref) {
  // Note: we will store the label in the node state
  // when we generate it
  if (xref.state && xref.state.label) {
    return xref.state.label
  }
  // otherwise we take the text content or an empty string
  return xref.textContent || ' '
}

function _getCitationManagerForXref (xref, context) {
  return _getManagerByRefType(xref.getAttribute('ref-type'), context, xref)
}

function _getManagerByRefType (refType, context, xref) {
  const articleSession = context.api.getArticleSession()
  let managerName = RefTypeToManager[refType]
  if (managerName) {
    switch (managerName) {
      case 'formulaManager':
        return articleSession.getFormulaManager()
      case 'figureManager':
        return articleSession.getFigureManager()
      case 'footnoteManager':
        return articleSession.getFootnoteManager()
      case 'referenceManager':
        return articleSession.getReferenceManager()
      case 'tableManager':
        return articleSession.getTableManager()
      default:
        //
    }
  } else if (xref) {
    // HACK/EXPERIMENTAL:
    // the above mechanism does not work for table-footnotes
    // there we need access to the current TableFigure and get its TableFootnoteManager
    let tableFigure = findParentByType(xref, 'table-figure')
    if (tableFigure) {
      return tableFigure.getFootnoteManager()
    }
  }
}

/*
  Computes available targets for a given xref node
  that the user can choose from.

  This implementation is very much tailored for the requirements
  in the UI, being a selection dialog.

  ```
  [
    {
      selected: true,
      node: TARGET_NODE
    }
    ,...
  ]
  ```
*/
export function getAvailableXrefTargets (xref, context) {
  let manager = _getCitationManagerForXref(xref, context)
  if (!manager) return []
  let selectedTargets = getXrefTargets(xref)
  // retrieve all possible nodes that this
  // xref could potentially point to,
  // so that we can let the user select from a list.
  let nodes = manager.getSortedCitables()
  // Determine broken targets (such that don't exist in the document)
  let brokenTargets = without(selectedTargets, ...nodes.map(r => r.id))
  let targets = nodes.map((node) => {
    // ATTENTION: targets are not just nodes
    // but entries with some information
    return {
      selected: includes(selectedTargets, node.id),
      node: node,
      id: node.id
    }
  })
  targets = brokenTargets.map(id => {
    return { selected: true, node: undefined, id }
  }).concat(targets)
  // Makes the selected targets go to top
  targets = orderBy(targets, ['selected'], ['desc'])
  return targets
}
