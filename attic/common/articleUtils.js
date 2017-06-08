export function getRefList(doc) {
  let refLists = doc.getIndex('type').get('ref-list')
  let refListId = Object.keys(refLists)[0]
  return refListId ? doc.get(refListId) : undefined
}

export function getContribGroup(doc) {
  let contribGroups = doc.getIndex('type').get('contrib-group')
  let contribGroupId = Object.keys(contribGroups)[0]
  return contribGroupId ? doc.get(contribGroupId) : undefined
}
