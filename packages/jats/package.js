'use strict';

var JATSImporter = require('./JATSImporter');
var JATSExporter = require('./JATSExporter');

module.exports = {
  name: 'jats',
  configure: function(config) {
    config.import(require('./article/package'));
    config.import(require('./back'));
    config.import(require('./body'));
    config.import(require('./bold'));
    config.import(require('./caption'));
    config.import(require('./xref'));
    config.import(require('./ext-link'));
    config.import(require('./figure'));
    config.import(require('./footnote'));
    config.import(require('./front'));
    config.import(require('./graphic'));
    config.import(require('./italic'));
    config.import(require('./label'));
    config.import(require('./monospace'));
    config.import(require('./paragraph'));
    config.import(require('./ref'));
    config.import(require('./ref-list'));
    config.import(require('./section'));
    config.import(require('./subscript'));
    config.import(require('./superscript'));
    config.import(require('./table'));
    // config.import(require('./table-wrap'));
    config.import(require('./title'));

    config.addImporter('jats', JATSImporter);
    config.addExporter('jats', JATSExporter);
  }
};