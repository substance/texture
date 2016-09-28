import { module } from './test'

const test = module('jats/front')

// attributes should be preserved
var withAttributes =
  '<front id="myfront" xml:base="testbase">'+
  '  <article-meta></article-meta>'+
  '</front>';
test.attributesConversion(withAttributes, 'front');

var simple =
  '<front>'+
  '  <article-meta></article-meta>'+
  '</front>';
test.withFixture(simple, 'Im-/Exporting simple <front>', function(t) {
  // import
  var importer = t.fixture.createImporter('front');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.notNil(node.articleMeta, 'node should have article-meta after import');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.ok(el.is('front'), 'exported element should be an <front>');
  t.ok(el.getChildAt(0).is('article-meta'), '.. having a <article-meta>');
  t.end();
});

var sophisticated =
  '<front>'+
  '  <journal-meta></journal-meta>'+
  '  <article-meta></article-meta>'+
  '  <def-list></def-list>'+
  '  <list></list>'+
  '  <ack></ack>'+
  '  <bio></bio>'+
  '  <fn-group></fn-group>'+
  '  <glossary></glossary>'+
  '  <notes></notes>'+
  '</front>';
test.withFixture(sophisticated, 'Im-/Exporting a more sophisticated <front>', function(t) {
  // import
  var importer = t.fixture.createImporter('front');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.notNil(node.articleMeta, 'node should have article-meta after import');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.ok(el.is('front'), 'exported element should be an <front>');
  [
    'journal-meta', 'article-meta',
    'def-list', 'list', 'ack', 'bio', 'fn-group', 'glossary', 'notes'
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
