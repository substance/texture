'use strict';

var JATSImporter = require('./JATSImporter');
var JATSExporter = require('./JATSExporter');

module.exports = {
  name: 'jats',
  configure: function(config) {
    config.import(require('./article'));
    config.import(require('./back'));
    config.import(require('./body'));
    config.import(require('./caption'));
    config.import(require('./cross-reference'));
    // config.import(require('./ext-link'));
    config.import(require('./figure'));
    config.import(require('./footnote'));
    config.import(require('./front'));
    config.import(require('./graphic'));
    config.import(require('./label'));
    config.import(require('./paragraph'));
    config.import(require('./ref'));
    config.import(require('./ref-list'));
    config.import(require('./section'));
    config.import(require('./table'));
    // config.import(require('./table-wrap'));
    config.import(require('./title'));

    config.addImporter('jats', JATSImporter);
    config.addExporter('jats', JATSExporter);
  }
};