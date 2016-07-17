import JATSImporter from '../jats/JATSImporter'
import JATSTransformer from './JATSTransformer'

class AuthorImporter extends JATSImporter {

  importDocument(...args) {
    var doc = super.importDocument(...args)
    var trafo = new JATSTransformer()
    doc = trafo.fromJATS(doc)
    return doc
  }

}

export default AuthorImporter
