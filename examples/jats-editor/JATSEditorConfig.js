var ScientistPackage = require('../../packages/scientist/ScientistPackage');
var ExampleXMLStore = require('../ExampleXMLStore');

module.exports = {
  name: 'my-prose-editor',
  configure: function(config) {
    // Base package with regular JATS support
    config.import(ScientistPackage);

    // Define XML Store
    config.setXMLStore(ExampleXMLStore); 
  }
};
