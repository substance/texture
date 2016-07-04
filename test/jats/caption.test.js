'use strict';

var test = require('./test').module('jats/caption');

// attributes should be preserved
var withAttributes =
  '<caption id="fixture1"' +
  '   content-type="test" specific-use="testing" style="test-style"' +
  '   xml:base="testbase" xml:lang="testlang"></caption>';
test.attributesConversion(withAttributes, 'caption');

// without title
var withoutTitle = '<caption><p>test</p></caption>';
test.withFixture(withoutTitle, 'Im-/Exporting caption without title', function(t) {
  // import
  var importer = t.fixture.createImporter('caption');
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
  var importer = t.fixture.createImporter('caption');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.notNil(node.title, 'title should be imported');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  var titleEl = el.find('title');
  t.notNil(titleEl, 'title should have been exported');
  t.end();
});

// empty
var empty = '<caption></caption>';
test.withFixture(empty, 'Im-/Exporting empty caption', function(t) {
  // import
  var importer = t.fixture.createImporter('caption');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.isNil(node.title, 'title should be nil after import');
  t.equal(node.getLength(), 0, 'there should be no content nodes');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.equal(el.innerHTML, '', 'the node should be empty after export');
  t.end();
});


// single p
var singleParagraph = '<caption><p>test</p></caption>';
test.withFixture(singleParagraph, 'Im-/Exporting caption with one paragraph', function(t) {
  // import
  var importer = t.fixture.createImporter('caption');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.equal(node.getLength(), 1, 'there should be one content node after import');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.equal(el.findAll('p').length, 1, 'there should be one content element after export.');
  t.end();
});

// multiple ps
var multipleParagraphs = '<caption><p>test</p><p>test2</p><p>test3</p></caption>';
test.withFixture(multipleParagraphs, 'Im-/Exporting caption with multiple paragraph', function(t) {
  // import
  var importer = t.fixture.createImporter('caption');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.equal(node.getLength(), 3, 'three content nodes should have been imported');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.equal(el.findAll('p').length, 3, 'three content nodes should have been exported');
  t.end();
});

// illegal content
var titleAfterContent = '<caption><p>test</p><title>Test</title></caption>';
test.withFixture(titleAfterContent, 'Illegal <caption>: title after content', function(t) {
  // import
  var importer = t.fixture.createImporter('caption');
  t.throws(function() {
    importer.convertElement(t.fixture.xmlElement);
  });
  t.end();
});

var multipleTitles = '<caption><title>Test</title><title>Test</title></caption>';
test.withFixture(multipleTitles, 'Illegal <caption>: multiple titles', function(t) {
  // import
  var importer = t.fixture.createImporter('caption');
  t.throws(function() {
    importer.convertElement(t.fixture.xmlElement);
  });
  t.end();
});

var unsupportedContentType = '<caption><fig></fig></caption>';
test.withFixture(unsupportedContentType, 'Illegal <caption>: unsupported content', function(t) {
  // import
  var importer = t.fixture.createImporter('caption');
  t.throws(function() {
    importer.convertElement(t.fixture.xmlElement);
  });
  t.end();
});
