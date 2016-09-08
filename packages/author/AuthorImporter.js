import JATSImporter from '../jats/JATSImporter'
import JATSTransformer from './JATSTransformer'

function AuthorImporter() {
  AuthorImporter.super.apply(this, arguments);
}

AuthorImporter.Prototype = function() {
  var _super = AuthorImporter.super.prototype;

  this.importDocument = function() {
    var doc = _super.importDocument.apply(this, arguments);
    var trafo = new JATSTransformer();
    doc = trafo.fromJATS(doc);
    return doc;
  };
};

JATSImporter.extend(AuthorImporter);

export default AuthorImporter;