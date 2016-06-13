'use strict';

var JATSImporter = require('./JATSImporter');
var JATSExporter = require('./JATSExporter');

module.exports = {
  name: 'scientist',
  configure: function(config) {
    // Now import base packages
    config.import(require('substance/packages/base/BasePackage'));
    config.import(require('substance/packages/persistence/PersistencePackage'));

    config.import(require('../article/ArticlePackage'));
    config.import(require('../body/BodyPackage'));
    config.import(require('../back/BackPackage'));

    config.import(require('../caption/CaptionPackage'));
    // config.import(require('../emphasis/EmphasisPackage'));
    config.import(require('../figure/FigurePackage'));

    // config.import(require('../footnote/FootnotePackage')); // not year ready
    config.import(require('../front/FrontPackage'));
    config.import(require('../graphic/GraphicPackage'));
    config.import(require('../link/LinkPackage'));
    config.import(require('../monospace/MonospacePackage'));
    config.import(require('../paragraph/ParagraphPackage'));

    config.import(require('../ref-list/RefListPackage'));
    config.import(require('../ref/RefPackage'));
    config.import(require('../cross-reference/CrossReferencePackage'));

    config.import(require('../section/SectionPackage'));
    config.import(require('../strong/StrongPackage'));
    config.import(require('../subscript/SubscriptPackage'));
    config.import(require('../superscript/SuperscriptPackage'));
    config.import(require('../table/TablePackage'));
    config.import(require('../table-wrap/TableWrapPackage'));

    // support inline wrappers, for all hybrid types that can be
    // block-level but also inline.
    config.import(require('../inline-wrapper/InlineWrapperPackage'));

    // catch all converters
    config.import(require('../unsupported/UnsupportedNodePackage'));

    config.addImporter('jats', JATSImporter);
    config.addExporter('jats', JATSExporter);
  }
};