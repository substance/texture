import { module } from './test'

const test = module('jats/xref')

// attributes should be preserved
var withAttributes =
  '<xref alt="abc" id="xref1" ref-type="bibr" rid="bib40" specific-use="abc" xml:base="test-base" xml:lang="en">Price et al., 1980</xref>';
test.attributesConversion(withAttributes, 'xref');

var simple =
  '<xref ref-type="bibr" rid="bib40 bib41">Price et al., 1980</xref>';
test.withFixture(simple, 'Im-/Exporting <xref>', function(t) {
  // import
  var importer = t.fixture.createImporter('xref');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.deepEqual(node.targets, ['bib40', 'bib41'], 'should have targets extracted');
  t.notNil(node.label, 'node should have a label');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.ok(el.is('xref'), 'element should be a <xref>');
  t.equal(el.textContent, 'Price et al., 1980');
  t.end();
});
