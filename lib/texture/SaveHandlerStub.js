class SaveHandlerStub {

  saveDocument(doc, changes, cb) {
    console.warn('No SaveHandler provided. Using Stub.')
    cb(null)
  }
}

export default SaveHandlerStub
