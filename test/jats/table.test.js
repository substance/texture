import { module } from './test'

const test = module('jats/table')

var withAttributes =
  '<table id="mytable"'+
  '   specific-use="test"'+
  '   xml:base="test-base">'+
  '</table>';
test.attributesConversion(withAttributes, 'table');

var simple =
  '<table><tr><td></td><td></td></tr><tr><td></td><td></td></tr></table>';
test.withFixture(simple, 'Im-/Exporting simple table', function(t) {
  // import
  var importer = t.fixture.createImporter('table');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.notNil(node.htmlContent, 'node should have HTML content after import');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.ok(el.is('table'), 'exported element should be an <table>');
  t.equal(el.findAll('tr').length, 2, '.. with 2 rows');
  t.equal(el.findAll('td').length, 4, '.. with 4 cell');
  t.end();
});
