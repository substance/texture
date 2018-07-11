export default function getAvailableOptions(api, targetTypes) {
  let items = []
  targetTypes.forEach(targetType => {
    items = items.concat(api.getCollectionForType(targetType))
  })
  return items.map(item => {
    return {
      id: item.id,
      text: api.renderEntity(item)
    }
  })
}
