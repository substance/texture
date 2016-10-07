import { module } from './test'

const test = module('jats/contrib')

// ATTENTION: refs are treated only as XML
var withAttributes =
  '<contrib id="contrib1"'+
  '   contrib-type="test">'+
  '   corresp="test">'+
  '   deceased="test">'+
  '   equal-contrib="test">'+
  '   rid="test">'+
  '   specific-use="test">'+
  '   xlink:actuate="test">'+
  '   xlink:href="test">'+
  '   xlink:role="test">'+
  '   xlink:show="test">'+
  '   xlink:title="test">'+
  '   xml:base="test">'+
  '   xmlns:xlink="test">'+
  '   <name></name>'+
  '</contrib>';
test.attributesConversion(withAttributes, 'contrib');

var simple = '<contrib><name></name><xref></xref></contrib>';

test.withFixture(simple, 'Im-/Exporting simple contrib', function(t) {
  // import
  var importer = t.fixture.createImporter('contrib');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.notNil(node.xmlContent, 'node should have XML content after import');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.ok(el.is('contrib'), 'should have exported a contrib element');
  t.ok(el.getChildAt(0).is('name'), '.. with name element');
  t.ok(el.getChildAt(1).is('xref'), '.. with xref element');
  t.end();
});
