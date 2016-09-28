import { module } from './test'

const test = module('jats/body')

// attributes should be preserved
var withAttributes =
  '<body id="mybody" specific-use="test" xml:base="testbase">'+
  '</body>';
test.attributesConversion(withAttributes, 'body');

var simple =
  '<body>'+
  '<p></p>'+
  '</body>';
test.withFixture(simple, 'Im-/Exporting simple <body>', function(t) {
  // import
  var importer = t.fixture.createImporter('body');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.equal(node.nodes.length, 1, 'node should have one content node after import');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.ok(el.is('body'), 'element should be a <body>');
  t.ok(el.getChildAt(0).is('p'), '.. having one <p>');
  t.end();
});

var sections =
  '<body>'+
  '<sec></sec>'+
  '<sec></sec>'+
  '<sec></sec>'+
  '</body>';
test.withFixture(sections, 'Im-/Exporting <body> with sections', function(t) {
  // import
  var importer = t.fixture.createImporter('body');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.equal(node.nodes.length, 3, 'node should have 3 content nodes after import');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.equal(el.findAll('sec').length, 3, 'there should be three sections after export');
  t.end();
});

var paragraphAfterSection =
  '<body>'+
  '<sec></sec>'+
  '<p></p>'+
  '</body>';
test.withFixture(paragraphAfterSection, 'Invalid JATS: paragraphs are not allowed after a section', function(t) {
  // import
  var importer = t.fixture.createImporter('body');
  t.throws(function() {
    importer.convertElement(t.fixture.xmlElement);
  });
  t.end();
});
