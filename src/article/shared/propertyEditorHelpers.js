export function getAvailableOptions (api, targetTypes) {
  let items = targetTypes.reduce((items, targetType) => {
    let collection = api.getCollectionForType(targetType)
    return items.concat(collection.getItems())
  }, [])
  return items.map(item => {
    return {
      id: item.id,
      text: api.renderEntity(item)
    }
  })
}
