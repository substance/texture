import includes from 'lodash/includes'
import map from 'lodash/map'
import orderBy from 'lodash/orderBy'

let TARGET_TYPES = {
  'fig': ['figure', 'fig-group'],
  'bibr': ['ref'],
  'table': ['table-wrap'],
  'other': ['figure']
}

/*
  Computes available targets for a given reference node

  Returns an array of entries with all info needed by XRefTargets to render
  [
    {
      selected: true,
      node: TARGET_NODE
    }
    ,...
  ]
*/
function getXRefTargets(node) {
  let doc = node.getDocument()
  let selectedTargets = node.targets
  let nodesByType = doc.getIndex('type')
  let refType = node.referenceType
  let targetTypes = TARGET_TYPES[refType]
  let targets = []

  targetTypes.forEach(function(targetType) {
    let nodesForType = map(nodesByType.get(targetType))

    nodesForType.forEach(function(node) {
      let isSelected = includes(selectedTargets, node.id)
      targets.push({
        selected: isSelected,
        node: node
      })
    })
  })

  // Makes the selected targets go to top
  targets = orderBy(targets, ['selected'], ['desc'])
  return targets
}

export default getXRefTargets
