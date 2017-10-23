import { includes, map, orderBy } from 'substance'

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

/*
  Computes available targets for a given xref node

  Returns an array of entries with all info needed by XRefTargets to render
  [
    {
      selected: true,
      node: TARGET_NODE
    }
    ,...
  ]
*/
export function getAvailableXrefTargets(node, labelGenerator) {
  let doc = node.getDocument()
  let selectedTargets = getXrefTargets(node)
  let nodesByType = doc.getIndex('type')
  let refType = node.getAttribute('ref-type')
  let targetTypes = XREF_TARGET_TYPES[refType]
  let targets = []

  targetTypes.forEach((targetType) => {
    let nodesForType = map(nodesByType.get(targetType)).filter((node) => {
      return Boolean(node.parentNode)
    })
    nodesForType.forEach(function(node) {
      let isSelected = includes(selectedTargets, node.id)
      targets.push({
        selected: isSelected,
        node: node,
        position: labelGenerator.getPosition('bibr', node.id)
      })
    })
  })

  // Makes the selected targets go to top
  targets = orderBy(targets, ['selected', 'position'], ['desc', 'asc'])
  return targets
}
