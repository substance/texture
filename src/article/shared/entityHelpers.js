import entityRenderers from './entityRenderers'

export function renderEntity(entity) {
  if (entity) {
    const renderer = entityRenderers[entity.type]
    if (renderer) {
      return renderer(entity.id, entity.getDocument())
    }
  }
}