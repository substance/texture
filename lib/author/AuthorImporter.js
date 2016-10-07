import JATSImporter from '../jats/JATSImporter'
import JATSTransformer from './JATSTransformer'

class AuthorImporter extends JATSImporter {

  importDocument(...args) {
    let doc = super.importDocument(...args)
    let trafo = new JATSTransformer()
    doc = trafo.fromJATS(doc)
    return doc
  }

}

export default AuthorImporter
