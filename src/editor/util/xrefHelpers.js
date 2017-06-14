import { includes, map, orderBy } from 'substance'

export const XREF_TARGET_TYPES = {
  'fn': ['fn'],
  'fig': ['figure', 'fig-group'],
  'bibr': ['ref'],
  'table': ['table-wrap'],
  'other': ['figure']
}

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
    let nodesForType = map(nodesByType.get(targetType))
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
