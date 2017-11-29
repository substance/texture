import { orderBy, includes } from 'substance'

// left side: node type
// right side: ref-type
export const REF_TYPES = {
  'fig': 'fig',
  'repro-fig': 'fig',
  'fig-group': 'fig',
  'fn': 'fn',
  'ref': 'bibr',
  'table-wrap': 'table',
  'table-wrap-group': 'table'
}

// TODO: how could this be configured?
const RefTypeToManager = {
  'bibr': 'references',
  'fig': 'figures',
  'table': 'tables',
  'fn': 'footnotes'
}


// left side: ref-type
// right side: [... node types]
export const XREF_TARGET_TYPES = Object.keys(REF_TYPES).reduce((m, type) => {
  const refType = REF_TYPES[type]
  if (!m[refType]) m[refType] = []
  m[refType].push(type)
  return m
}, {})

export function getXrefTargets(xref) {
  let idrefs = xref.getAttribute('rid')
  if (idrefs) {
    return idrefs.split(' ')
  } else {
    return []
  }
}

export function getXrefLabel(xref) {
  // Note: we will store the label in the node state
  // when we generate it
  if (xref.state && xref.state.label) {
    return xref.state.label
  }
  // otherwise we take the text content or an empty string
  return xref.textContent || ' '
}

function getXrefResourceManager(xref, editorSession) {
  let managerName = RefTypeToManager[xref.getAttribute('ref-type')]
  if (managerName) {
    return editorSession.getManager(managerName)
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
export function getAvailableXrefTargets(xref, editorSession) {
  let manager = getXrefResourceManager(xref, editorSession)
  if (!manager) return []

  let selectedTargets= getXrefTargets(xref)
  // retrieve all possible nodes that this
  // xref could potentially point to,
  // so that we can let the user select from a list.
  let nodes = manager.getAvailableResources()
  let targets = nodes.map((node) => {
    // ATTENTION: targets are not just nodes
    // but entries with some information (e.g. if)
    return {
      selected: includes(selectedTargets, node.id),
      node: node
    }
  })
  // Makes the selected targets go to top
  targets = orderBy(targets, ['selected'], ['desc'])
  return targets
}
