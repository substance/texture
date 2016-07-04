'use strict';

module.exports = function(test, tagName, type) {
  type = type || tagName;
  var fixture = '<'+tagName+'>abc<bold id="b1">def</bold>ghi</'+tagName+'>';
  test.withFixture(fixture, 'Importing/exporting <'+tagName+'>', function(t) {
    // import
    var importer = t.fixture.createImporter([type, 'bold']);
    var node = importer.convertElement(t.fixture.xmlElement);
    // HACK: still we need to call this, otherwise annotations
    // are not created
    importer._createInlineNodes();
    t.equal(node.getText(), 'abcdefghi', 'text content should have been imported correctly');
    // export
    var exporter = t.fixture.createExporter();
    var el = exporter.convertNode(node);
    t.ok(el.is(tagName), 'exported element should be a <'+tagName+'> element');
    t.equal(el.innerHTML, 'abc<bold id="b1">def</bold>ghi', 'nodes content should be exported');
    t.end();
  });
};