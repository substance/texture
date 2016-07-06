'use strict';

var test = require('./test').module('jats/paragraph');

var testTextNode = require('./testTextNode');

var withAttributes =
  '<p id="myp"'+
  '  content-type="prose" specific-use="test"'+
  '  xml:base="testbase" xml:lang="lang">'+
  '</p>';
test.attributesConversion(withAttributes, 'paragraph');

testTextNode(test, 'p', 'paragraph');
