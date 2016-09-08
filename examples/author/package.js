import TexturePackage from '../../packages/texture/package'
import ExampleXMLStore from '../ExampleXMLStore'

export default {
  name: 'author-example',
  configure: function(config) {
    // Use the default Texture package
    config.import(TexturePackage);
    // Define XML Store
    config.setXMLStore(ExampleXMLStore);
  }
};
