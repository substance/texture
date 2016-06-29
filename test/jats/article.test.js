'use strict';

var test = require('./test').module('jats/article');

// attributes should be preserved
var withAttributes =
  '<article id="myArticle"' +
  '   article-type="test" specific-use="testing" dtd-version="1.1"' +
  '   xml:base="testbase" xml:lang="testlang"'+
  '   xmlns:ali="ali" xmlns:mml="mml" xmlns:xlink="xlink" xmlns:xsi="xsi">'+
  '<front></front>'+
  '</article>';
test.attributesConversion(withAttributes, 'article');

var simple =
  '<article>'+
  '<front></front>'+
  '<body></body>'+
  '<back></back>'+
  '</article>';
test.withFixture(simple, 'Im-/Exporting simple article', function(t) {
  // import
  var importer = t.fixture.createImporter('article');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.notNil(node.front, 'article should have front-matter');
  t.notNil(node.body, 'article should have body');
  t.notNil(node.back, 'article should have back-matter');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.ok(el.is('article'), 'created element should be an <article>');
  t.ok(el.getChildAt(0).is('front'), '.. having a <front>');
  t.ok(el.getChildAt(1).is('body'), '.. having a <body>');
  t.ok(el.getChildAt(2).is('back'), '.. and a <back>');
  t.end();
});


var floatsGroup =
  '<article>'+
  '<front></front>'+
  '<floats-group></floats-group>'+
  '</article>';
test.withFixture(floatsGroup, 'Im-/Exporting article with floats-group', function(t) {
  // import
  var importer = t.fixture.createImporter('article');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.notNil(node.floatsGroup, 'imported article node should have floatsGroup');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.notNil(el.find('floats-group'), 'a <floats-group> should have been exported');
  t.end();
});

var subarticles =
  '<article>'+
  '<front></front>'+
  '<sub-article></sub-article>'+
  '<sub-article></sub-article>'+
  '</article>';
test.withFixture(subarticles, 'Im-/Exporting article with sub-articles', function(t) {
  // import
  var importer = t.fixture.createImporter('article');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.equal(node.subArticles.length, 2, 'imported article node should have 2 sub-articles');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.equal(el.findAll('sub-article').length, 2, 'two <sub-article>s should have been exported');
  t.end();
});

var response =
  '<article>'+
  '<front></front>'+
  '<response></response>'+
  '<response></response>'+
  '</article>';
test.withFixture(response, 'Im-/Exporting article with responses', function(t) {
  // import
  var importer = t.fixture.createImporter('article');
  var node = importer.convertElement(t.fixture.xmlElement);
  t.equal(node.responses.length, 2, 'imported article node should have 2 responses');
  // export
  var exporter = t.fixture.createExporter();
  var el = exporter.convertNode(node);
  t.equal(el.findAll('response').length, 2, 'two <response>s should have been exported');
  t.end();
});

var noFront =
  '<article>'+
  '</article>';
test.withFixture(noFront, 'Invalid <article>: no front matter', function(t) {
  // import
  var importer = t.fixture.createImporter('article');
  t.throws(function() {
    importer.convertElement(t.fixture.xmlElement);
  });
  t.end();
});
