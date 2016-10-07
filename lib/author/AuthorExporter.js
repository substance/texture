import JATSExporter from '../jats/JATSExporter'
import JATSTransformer from './JATSTransformer'

class AuthorExporter extends JATSExporter {

  exportDocument(doc) {
    let trafo = new JATSTransformer()
    doc = trafo.toJATS(doc)
    return super.exportDocument(doc)
  }

}

export default AuthorExporter
