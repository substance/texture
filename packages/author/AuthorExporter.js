import JATSExporter from '../jats/JATSExporter'
import JATSTransformer from './JATSTransformer'

function AuthorExporter() {
  AuthorExporter.super.apply(this, arguments);
}

AuthorExporter.Prototype = function() {
  var _super = AuthorExporter.super.prototype;

  this.exportDocument = function(doc) {
    var trafo = new JATSTransformer();
    doc = trafo.toJATS(doc);
    return _super.exportDocument.call(this, doc);
  };
};

JATSExporter.extend(AuthorExporter);

export default AuthorExporter;
