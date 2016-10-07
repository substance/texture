import { module } from './test'

const test = module('jats/graphic')

// attributes should be preserved
var withAttributes =
  '<graphic id="graphic1" content-type="$" mime-subtype="$" mimetype="$" orientation="$" '+
      'position="$" specific-use="$" xlink:actuate="$" xlink:href="$" xlink:role="$" '+
      'xlink:show="$" xlink:title="$" xlink:type="$" xml:base="$" xml:lang="$" xmlns:xlink="$">'+
  '</graphic>';
test.attributesConversion(withAttributes, 'graphic');

var simple =
  '<graphic xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="fors2662.f1">'+
  '</graphic>';
test.withFixture(simple, 'Im-/Exporting simple <graphic>', function(t) {
  // import
  var importer = t.fixture.createImporter('graphic');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.equal(node.nodes.length, 0, 'node should have no child elements');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.ok(el.is('graphic'), 'element should be a <graphic>');
  t.end();
});

var withElements =
  '<graphic xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="fors2662.f1">'+
  '<object-id>456472</object-id>'+
  '<label>abc</label>'+
  '</graphic>';
test.withFixture(withElements, 'Im-/Exporting <graphic> with some elements', function(t) {
  // import
  var importer = t.fixture.createImporter('graphic');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.equal(node.nodes.length, 2, 'node should have 2 elements');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.ok(el.is('graphic'), 'element should be a <graphic>');
  t.ok(el.getChildAt(0).is('object-id'), '.. having one <object-id>');
  t.ok(el.getChildAt(1).is('label'), '.. having one <label>');
  t.end();
});

