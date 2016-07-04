'use strict';

var test = require('./test').module('jats/inline-wrapper');

var createJATSConfigurator = require('./createJATSConfigurator');

test('Exporting a wrapped jats node', function(t) {
  var configurator = createJATSConfigurator();
  var doc = configurator.createArticle(function(doc) {
    doc.create({
      type: 'graphic',
      id: 'g',
      attributes: {
        'xlink:href': 'test'
      }
    });
    doc.create({
      type: 'inline-wrapper',
      id: 'iw',
      path: ['iw', '_content'],
      _content: '$',
      startOffset: 0,
      endOffset: 1,
      wrappedNode: 'g'
    });
  });
  var iw = doc.get('iw');
  var exporter = configurator.createExporter('jats');
  // this should return the converted wrapped node
  var el = exporter.convertNode(iw);
  t.equal(el.tagName, 'graphic', 'should have exported a graphic element');
  t.equal(el.attr('xlink:href'), 'test', '.. with correct xlink:href attribute');
  t.end();
});
