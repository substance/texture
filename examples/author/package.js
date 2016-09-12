import AuthorPackage from '../../packages/author/package'
import ExampleXMLStore from '../ExampleXMLStore'

export default {
  name: 'author-example',
  configure: function(config) {
    config.import(AuthorPackage)
    config.setXMLStore(ExampleXMLStore);
  }
};
