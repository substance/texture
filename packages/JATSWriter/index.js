'use strict';

var Overlay = require('substance/ui/Overlay');

module.exports = {
  name: 'JATSWriter',
  configure: function(config) {
    // Now import base packages
    config.import(require('substance/packages/base/BasePackage'));
    config.import(require('substance/packages/persistence/PersistencePackage'));

    config.addComponent('overlay', Overlay);

    config.import(require('../jats'))

    // support inline wrappers, for all hybrid types that can be
    // block-level but also inline.
    config.import(require('../inline-wrapper/InlineWrapperPackage'));

    // catch all converters
    config.import(require('../unsupported/UnsupportedNodePackage'));
  }
};