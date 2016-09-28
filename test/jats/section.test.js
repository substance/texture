import { module } from './test'

const test = module('jats/section')

// attributes should be preserved
var withAttributes =
  '<sec id="myfront"'+
  '  disp-level="1"'+
  '  sec-type="default"'+
  '  specific-use="test"'+
  '  xml:base="testbase" xml:lang="lang">'+
  '</sec>';
test.attributesConversion(withAttributes, 'section');

var simple =
  '<sec>'+
  '  <title></title>'+
  '  <p></p>'+
  '  <p></p>'+
  '  <p></p>'+
  '</sec>';
test.withFixture(simple, 'Im-/Exporting simple section', function(t) {
  // import
  var importer = t.fixture.createImporter('section');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.notNil(node.title, 'node should have a title after import');
  t.equal(node.nodes.length, 3, 'node should have three content nodes after import');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.ok(el.is('sec'), 'exported element should be an <sec>');
  t.ok(el.getChildAt(0).is('title'), '.. with a title');
  t.equal(el.findAll('p').length, 3, '.. with 3 paragraphs');
  t.end();
});

var nested =
  '<sec id="s1">'+
  '  <title></title>'+
  '  <p></p>'+
  '  <sec id="s1-1">'+
  '    <title></title>'+
  '    <p></p>'+
  '  </sec>'+
  '</sec>';
test.withFixture(nested, 'Im-/Exporting a nested section', function(t) {
  // import
  var importer = t.fixture.createImporter('section');
  var node = importer.convertElement(t.fixture.xmlElement);
  var doc = node.getDocument();
  var s1 = doc.get('s1');
  var s1_1 = doc.get('s1-1');
  t.notNil(s1, 'section 1 should have been imported');
  t.notNil(s1_1, 'section 1.1 should have been imported');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.ok(el.is('sec'), 'exported element should be an <sec>');
  t.notNil(el.find('sec'), '.. with a sub-section');
  t.end();
});

// not allowed
var paragraphAfterSection =
  '<sec>'+
  '  <title></title>'+
  '  <sec></sec>'+
  '  <p></p>'+
  '</sec>';
test.withFixture(paragraphAfterSection, 'Paragraph after section is not allowed', function(t) {
  var importer = t.fixture.createImporter('section');
  t.throws(function() {
    importer.convertElement(t.fixture.xmlElement);
  });
  t.end();
});
