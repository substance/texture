import entityRenderers from './entityRenderers'

export default function renderEntity (entity, exporter, options = {}) {
  if (entity) {
    const type = entity.type
    let renderer = entityRenderers[type]
    if (renderer) {
      let doc = entity.getDocument()
      return renderer(entity.id, doc, exporter, options)
    } else {
      console.error(`No renderer available for type '${type}'`)
    }
  }
  return ''
}
