'use strict';

var test = require('./test').module('jats/figure');

var withAttributes =
  '<fig id="myfig"'+
  '   fig-type="graphic"'+
  '   specific-use="test" orientation="portrait" position="float"'+
  '   xml:base="test-base" xml:lang="testlang">'+
  '</fig>';
test.attributesConversion(withAttributes, 'figure');


var simple =
  '<fig>'+
  '  <caption></caption>'+
  '  <graphic></graphic>'+
  '</fig>';
test.withFixture(simple, 'Im-/Exporting simple <fig>', function(t) {
  // import
  var importer = t.fixture.createImporter('figure');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.equal(node.captions.length, 1, 'node should have one caption after import');
  t.equal(node.contentNodes.length, 1, 'node should have one content node after import');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.ok(el.is('fig'), 'element should be a <fig>');
  t.ok(el.getChildAt(0).is('caption'), '.. having one <caption>');
  t.ok(el.getChildAt(1).is('graphic'), '.. having one <graphic>');
  t.end();
});

var advanced =
  '<fig>'+
  '  <object-id></object-id>'+
  '  <label></label>'+
  '  <caption></caption>'+
  '  <abstract></abstract>'+
  '  <kwd-group></kwd-group>'+
  '  <alt-text></alt-text>'+
  '  <long-desc></long-desc>'+
  '  <graphic></graphic>'+
  '  <attrib></attrib>'+
  '  <permissions></permissions>'+
  '</fig>';
test.withFixture(advanced, 'Im-/Exporting a more sophisticated <fig>', function(t) {
  // import
  var importer = t.fixture.createImporter('figure');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.equal(node.objectIds.length, 1, 'node should have one object-id after import');
  t.notNil(node.label, 'node should have a label');
  t.equal(node.captions.length, 1, 'node should have one caption after import');
  t.equal(node.abstracts.length, 1, 'node should have one abstract after import');
  t.equal(node.kwdGroups.length, 1, 'node should have one kwd-group after import');
  t.equal(node.altTexts.length, 1, 'node should have one alt-text after import');
  t.equal(node.longDescs.length, 1, 'node should have one long-desc after import');
  t.equal(node.attribs.length, 1, 'node should have one attrib after import');
  t.equal(node.permissions.length, 1, 'node should have one permissions after import');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.ok(el.is('fig'), 'element should be a <fig>');
  [
    'object-id', 'label', 'caption', 'abstract', 'kwd-group',
    'alt-text', 'long-desc', 'graphic', 'attrib', 'permissions'
  ].forEach(function(tagName, i) {
    var child = el.getChildAt(i);
    if (child) {
      t.ok(child.is(tagName), '.. having one <'+tagName+'>');
    } else {
      t.fail('Invalid number of child elements');
    }
  });
  t.end();
});
