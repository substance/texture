import { request } from 'substance'

class ExampleXMLStore {

  readXML(documentId, cb) {
    let cached = localStorage.getItem(documentId)
    if (cached) {
      return cb(null, cached)
    }
    request('GET', '../data/'+documentId+'.xml', null, cb)
  }

  // TODO make functional
  writeXML(documentId, xml, cb) {
    localStorage.setItem(documentId, xml)
    cb(null)
  }

}

export default ExampleXMLStore
