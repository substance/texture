'use strict';

var Overlay = require('substance/ui/Overlay');
var Toolbar = require('substance/ui/Toolbar');

module.exports = {
  name: 'publisher',
  configure: function(config) {
    // Now import base packages
    config.import(require('substance/packages/base/BasePackage'));
    config.import(require('substance/packages/persistence/PersistencePackage'));
    config.addComponent('overlay', Overlay);
    // TODO: this should be used as default, too
    config.setToolbarClass(Toolbar);
    config.import(require('../jats/package'));
    config.import(require('../common/package'));
    // support inline wrappers, for all hybrid types that can be
    // block-level but also inline.
    config.import(require('../inline-wrapper/InlineWrapperPackage'));
    // catch all converters
    config.import(require('../unsupported/UnsupportedNodePackage'));
  }
};