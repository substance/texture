'use strict';

var test = require('./test').module('jats/ref-list');

var withAttributes =
  '<ref-list id="myp"'+
  '  content-type="prose" specific-use="test"'+
  '  xml:base="testbase" xml:lang="lang">'+
  '</ref-list>';
test.attributesConversion(withAttributes, 'ref-list');

var simple =
  '<ref-list>'+
  '  <title></title>'+
  '  <ref></ref>'+
  '  <ref></ref>'+
  '  <ref></ref>'+
  '</ref-list>';
test.withFixture(simple, 'Im-/Exporting simple ref-list', function(t) {
  // import
  var importer = t.fixture.createImporter('ref-list');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.notNil(node.title, 'node should have a title after import');
  t.equal(node.nodes.length, 3, 'node should have 3 content nodes');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.ok(el.is('ref-list'), 'should have exported a ref-list element');
  t.ok(el.getChildAt(0).is('title'), '.. with title');
  t.equal(el.findAll('ref').length, 3, '.. and 3 refs');
  t.end();
});

var nested =
  '<ref-list>'+
  '  <label></label>'+
  '  <title></title>'+
  '  <ref></ref>'+
  '  <ref-list id="nested"></ref-list>'+
  '</ref-list>';
test.withFixture(nested, 'Im-/Exporting a nested ref-list', function(t) {
  // import
  var importer = t.fixture.createImporter('ref-list');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.notNil(node.label, 'node should have a label after import');
  t.notNil(node.title, 'node should have a title after import');
  t.notNil(node.getDocument().get('nested'), 'nested ref-list should be imported');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.ok(el.is('ref-list'), 'should have exported a ref-list element');
  t.ok(el.getChildAt(0).is('label'), '.. with label');
  t.ok(el.getChildAt(1).is('title'), '.. a title');
  t.notNil(el.find('ref'), '.. a ref');
  t.notNil(el.find('ref-list'), '.. and a nested ref-list');
  t.end();
});
