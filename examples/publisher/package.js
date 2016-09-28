import PublisherPackage from '../../packages/publisher/package'
import ExampleXMLStore from '../ExampleXMLStore'

export default {
  name: 'publisher-example',
  configure: function(config) {
    config.import(PublisherPackage)
    config.setXMLStore(ExampleXMLStore);
  }
}

