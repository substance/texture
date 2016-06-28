'use strict';

var test = require('../test').module('jats/Caption');

// attributes should be preserved
var withAttributes =
  '<caption id="fixture1"' +
  '   content-type="test" specific-use="testing" style="test-style"' +
  '   xml:base="testbase" xml:lang="testlang"></caption>';
test.attributesConversion(withAttributes);

// without title
var withoutTitle = '<caption><p>test</p></caption>';
test.withFixture(withoutTitle, 'Im-/Exporting caption without title', function(t) {
  // import
  var importer = t.fixture.createImporter();
  var node = importer.convertElement(t.fixture.xmlElement);
  t.isNil(node.title, 'title should be nil after import');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.ok(el.is('caption'), 'created element should be a <caption>');
  t.isNil(el.find('title'), 'there should be no <title> after export');
  t.end();
});

// title but no content
var titleNoContent = '<caption><title>Test</title></caption>';
test.withFixture(titleNoContent, 'Im-/Exporting caption with title but no content', function(t) {
  // import
  var importer = t.fixture.createImporter();
  var node = importer.convertElement(t.fixture.xmlElement);
  t.notNil(node.title, 'title should be nil after import');
  t.equal(node.getTitle().getText(), 'Test', 'title should have been extracted correctly');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  var titleEl = el.find('title');
  t.notNil(titleEl, 'there should be a <title> after export');
  t.equal(titleEl.text(), 'Test', 'the title content should be exported correctly');
  t.end();
});

// empty
var empty = '<caption></caption>';
test.withFixture(empty, 'Im-/Exporting empty caption', function(t) {
  // import
  var importer = t.fixture.createImporter();
  var node = importer.convertElement(t.fixture.xmlElement);
  t.isNil(node.title, 'title should be nil after import');
  t.equal(node.getLength(), 0, 'there should be no content nodes');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.equal(el.innerHTML, '', 'the node should be empty after export');
  t.end();
});


// sinple p
var singleParagraph = '<caption><p>test</p></caption>';
test.withFixture(singleParagraph, 'Im-/Exporting caption with one paragraph', function(t) {
  // import
  var importer = t.fixture.createImporter();
  var node = importer.convertElement(t.fixture.xmlElement);
  t.equal(node.getLength(), 1, 'there should be one content node');
  t.equal(node.getChildAt(0).type, 'paragraph', '.. which should be paragraph');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.equal(el.getChildCount(), 1, 'the exported element should have one child element');
  t.ok(el.getChildAt(0).is('p'), '... which should be a <p> element');
  t.end();
});

// multiple ps
var multipleParagraphs = '<caption><p>test</p><p>test2</p><p>test3</p></caption>';
test.withFixture(multipleParagraphs, 'Im-/Exporting caption with multiple paragraph', function(t) {
  // import
  var importer = t.fixture.createImporter();
  var node = importer.convertElement(t.fixture.xmlElement);
  t.equal(node.getLength(), 3, 'there should be three content nodes');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.equal(el.getChildCount(), 3, 'the exported element should have three child elements');
  t.end();
});

// illegal content
var titleAfterContent = '<caption><p>test</p><title>Test</title></caption>';
test.withFixture(titleAfterContent, 'Illegal <caption>: title after content', function(t) {
  // import
  var importer = t.fixture.createImporter();
  t.throws(function() {
    importer.convertElement(t.fixture.xmlElement);
  })
  t.end();
});
var multipleTitles = '<caption><title>Test</title><title>Test</title></caption>';
test.withFixture(multipleTitles, 'Illegal <caption>: multiple titles', function(t) {
  // import
  var importer = t.fixture.createImporter();
  t.throws(function() {
    importer.convertElement(t.fixture.xmlElement);
  })
  t.end();
});
var unsupportedContentType = '<caption><fig></fig></caption>';
test.withFixture(titleAfterContent, 'Illegal <caption>: unsupported content', function(t) {
  // import
  var importer = t.fixture.createImporter();
  t.throws(function() {
    importer.convertElement(t.fixture.xmlElement);
  })
  t.end();
});
