import { module } from './test'

const test = module('jats/back')

// attributes should be preserved
var withAttributes =
  '<back id="myback" xml:base="testbase">'+
  '</back>';
test.attributesConversion(withAttributes, 'back');

var simple =
  '<back>'+
  '<label></label>'+
  '<title></title>'+
  '<sec></sec>'+
  '</back>';
test.withFixture(simple, 'Im-/Exporting simple <back>', function(t) {
  // import
  var importer = t.fixture.createImporter('back');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.notNil(node.label, 'node should have a label');
  t.equal(node.titles.length, 1, '.. and one title');
  t.equal(node.nodes.length, 1, '.. and one content node.');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.ok(el.is('back'), 'element should be a <back>');
  t.ok(el.getChildAt(0).is('label'), '.. having a <label>');
  t.ok(el.getChildAt(1).is('title'), '.. having a <title>');
  t.ok(el.getChildAt(2).is('sec'), '.. and a <sec>');
  t.end();
});

var multipleTitles =
  '<back>'+
  '<title></title>'+
  '<title></title>'+
  '<title></title>'+
  '</back>';
test.withFixture(multipleTitles, 'Im-/Exporting a <back> with multiple titles', function(t) {
  // import
  var importer = t.fixture.createImporter('back');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.equal(node.titles.length, 3, 'there should be 3 titles after import');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.equal(el.findAll('title').length, 3, 'there should be 3 <title> elements after export');
  t.end();
});

var withContent =
  '<back>'+
    '<ack></ack>'+
    '<app-group></app-group>' +
    '<bio></bio>' +
    '<fn-group></fn-group>' +
    '<glossary></glossary>' +
    '<ref-list></ref-list>' +
    '<notes></notes>' +
    '<sec></sec>' +
  '</back>';
test.withFixture(withContent, 'Im-/Exporting a <back> with multiple titles', function(t) {
  // import
  var importer = t.fixture.createImporter('back');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.equal(node.nodes.length, 8, 'there should be 8 content nodes after import');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.equal(el.getChildCount(), 8, 'there should be 8 child elements after export');
  t.end();
});
