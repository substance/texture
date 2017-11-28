import { map, orderBy } from 'substance'

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


// left side: ref-type
// right side: [... node types]
export const XREF_TARGET_TYPES = Object.keys(REF_TYPES).reduce((m, type) => {
  const refType = REF_TYPES[type]
  if (!m[refType]) m[refType] = []
  m[refType].push(type)
  return m
}, {})

// HACK: hard coded mapping from JATS ref-type to EntityDb types
export const ENTITY_TYPES = {
  'ref': 'bibr'
}

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
export function getAvailableXrefTargets(node, entityDb) {
  let refType = node.getAttribute('ref-type')
  // these ids are currently referenced by the <xref>
  let selectedTargets = getXrefTargets(node)
  // a specific ref-type can point to multiple node types
  let targetTypes = XREF_TARGET_TYPES[refType]

  function _isSelected(nodeId) {
    return selectedTargets.indexOf(nodeId) >= 0
  }
  // now we want to retrieve all possible nodes that this
  // xref could potentially point to,
  // so that we can let the user select from a list.
  // Some of the nodes are stored in the document,
  // but others are in the entityDb.
  let targets = []
  targetTypes.forEach((targetType) => {
    let nodes
    let isEntity = Boolean(ENTITY_TYPES[targetType])
    if (isEntity) {
      let entityType = ENTITY_TYPES[targetType]
      let nodeIds = entityDb.find({
        type: entityType
      })
      nodes = nodeIds.map(id => entityDb.get(id))
    } else {
      let nodesByType = node.getDocument().getIndex('type')
      // TODO: why do we need that filter?
      nodes = map(nodesByType.get(targetType)).filter((node) => {
        return Boolean(node.parentNode)
      })
    }
    nodes.forEach((node) => {
      targets.push({
        selected: _isSelected(node.id),
        node: node,
        // TODO: position depends on the type
        // e.g. bibr's should probably be presented in the order
        // they occur in the ref list,
        // while figures should be in order as they occur in the document
        // position: labelGenerator.getPosition('bibr', node.id)
        // Let's see how far we get without position
        position: -1,
        isEntity
      })
    })
  })
  // Makes the selected targets go to top
  targets = orderBy(targets, ['selected'], ['desc'])
  return targets
}
