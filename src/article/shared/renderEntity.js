import entityRenderers from './entityRenderers'

// TODO: rethink this.
// The fact that it needs an exporter makes it not very useful.
// In general I think that these renderers should not depend on an HTML exporter
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
