'use strict';

var test = require('./test').module('jats/unsupported');

// attributes should be preserved
var withAttributes =
  '<foo-bar test-attr="test"></foo-bar>';
test.attributesConversion(withAttributes, 'foo-bar');

var simple =
  '<foo-bar>'+
  '<x>hello</x>'+
  '<y>world</y>'+
  '</foo-bar>';
test.withFixture(simple, 'Im-/Exporting of unsupported node type', function(t) {
  // import
  var importer = t.fixture.createImporter('article');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.equal(node.xmlContent, '<x>hello</x><y>world</y>');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.ok(el.getChildAt(0).is('x'), '.. having an <x>');
  t.ok(el.getChildAt(1).is('y'), '.. having a <y>');
  t.end();
});
