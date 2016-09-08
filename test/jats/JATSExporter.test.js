'use strict';

var test = require('./test').module('jats/JATSExporter');

import createJATSConfigurator from './createJATSConfigurator'

test('Exporting a node via id', function(t) {
  var configurator = createJATSConfigurator();
  var doc = configurator.createArticle(function(doc) {
    doc.create({
      type: 'graphic',
      id: 'g',
      attributes: { 'xlink:href': 'test' }
    });
  });
  var exporter = configurator.createExporter('jats');
  // HACK: usually we would not set this but here we
  // need to set the doc, as we want to use convertNode(id)
  exporter.state.doc = doc;
  // this should return the converted wrapped node
  var el = exporter.convertNode('g');
  t.equal(el.tagName, 'graphic', 'should have exported a graphic element');
  t.equal(el.attr('xlink:href'), 'test', '.. with correct xlink:href attribute');
  t.end();
});
