import TexturePackage from '../../packages/texture/package'
import ExampleXMLStore from '../ExampleXMLStore'

export default {
  name: 'publisher-example',
  configure: function(config) {
    config.import(TexturePackage);
    // Define XML Store
    config.setXMLStore(ExampleXMLStore);
  }
}

