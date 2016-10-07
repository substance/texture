import { module } from './test'

const test = module('jats/ref')

// ATTENTION: refs are treated only as XML
var withAttributes =
  '<ref id="myref"'+
  '   specific-use="test">'+
  '   <mixed-citation></mixed-citation>'+
  '</ref>';
test.attributesConversion(withAttributes, 'ref');

var simple = '<ref><label></label><mixed-citation></mixed-citation></ref>';
test.withFixture(simple, 'Im-/Exporting simple ref', function(t) {
  // import
  var importer = t.fixture.createImporter('ref');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.notNil(node.xmlContent, 'node should have XML content after import');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.ok(el.is('ref'), 'should have exported a ref element');
  t.ok(el.getChildAt(0).is('label'), '.. with label');
  t.notNil(el.find('mixed-citation'), '.. with a mixed-citation');
  t.end();
});
