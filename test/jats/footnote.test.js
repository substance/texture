import { module } from './test'

const test = module('jats/footnote')

// attributes should be preserved
var withAttributes =
  '<fn id="fn1"' +
  '   fn-type="con" specific-use="testing" symbol="test"' +
  '   xml:base="testbase" xml:lang="testlang"><p>Footnote 1</p></fn>';
test.attributesConversion(withAttributes, 'footnote');

// without label, one paragraph
var withoutLabel =
  '<fn id="fn1"' +
  '   fn-type="con" specific-use="testing" symbol="test"' +
  '   xml:base="testbase" xml:lang="testlang"><p>Footnote 1</p></fn>';

test.withFixture(withoutLabel, 'Im-/Exporting <fn> without label', function(t) {
  // import
  var importer = t.fixture.createImporter('footnote');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.isNil(node.label, 'label should be nil after import');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.ok(el.is('fn'), 'created element should be a <fn>');
  t.isNil(el.find('label'), 'there should be no <label> after export');
  t.end();
});

// with label, one paragraph
var withLabel =
  '<fn id="fn1"' +
  '   fn-type="con" specific-use="testing" symbol="test"' +
  '   xml:base="testbase" xml:lang="testlang"><label>Footnote Label 1</label><p>Footnote 1</p></fn>';

test.withFixture(withLabel, 'Im-/Exporting <fn> including label', function(t) {
  // import
  var importer = t.fixture.createImporter('footnote');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.notNil(node.label, 'label should be set after import');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.ok(el.is('fn'), 'created element should be a <fn>');
  t.notNil(el.find('label'), 'there should be a <label> after export');
  t.end();
});
