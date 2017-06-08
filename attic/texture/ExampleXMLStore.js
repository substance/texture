import { request } from 'substance'

class ExampleXMLStore {

  constructor(data) {
    this.data = data
  }

  readXML(documentId, cb) {
    let cached = localStorage.getItem(documentId)
    if (cached) {
      return cb(null, cached)
    }
    cb(null, this.data[documentId])
  }

  writeXML(documentId, xml, cb) {
    localStorage.setItem(documentId, xml)
    cb(null)
  }
}

export default ExampleXMLStore
