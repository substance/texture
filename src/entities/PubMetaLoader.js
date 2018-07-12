import { JSONConverter } from 'substance'
import createEntityDbSession from './createEntityDbSession'

export default {
  load(jsonStr) {
    let doc = createEntityDbSession()
    if (jsonStr) {
      let data = JSON.parse(jsonStr)
      JSONConverter.importDocument(doc, data)
    }
    return doc
  }
}
