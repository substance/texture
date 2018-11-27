import { DocumentNode as SubstanceDocumentNode, forEach } from 'substance'

/*
 ATTENTION: this is a preliminary extension of the Substance.DocumentNode
 After consolidation this will be merged into Substance.
*/
export default class DocumentNode extends SubstanceDocumentNode {
  getChildren () {
    const doc = this.getDocument()
    const id = this.id
    const schema = this.getSchema()
    let result = []
    for (let p of schema) {
      const name = p.name
      if (p.isText()) {
        let annos = doc.getAnnotations([id, name])
        forEach(annos, a => result.push(a))
      } else if (p.isReference() && p.isOwned()) {
        let val = this[name]
        if (val) {
          if (p.isArray()) {
            result = result.concat(val.map(id => doc.get(id)))
          } else {
            result.push(doc.get(val))
          }
        }
      }
    }
    return result
  }
}
