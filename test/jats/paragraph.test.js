import { module } from './test'
import testTextNode from './testTextNode'

const test = module('jats/paragraph')

var withAttributes =
  '<p id="myp"'+
  '  content-type="prose" specific-use="test"'+
  '  xml:base="testbase" xml:lang="lang">'+
  '</p>';
test.attributesConversion(withAttributes, 'paragraph');

testTextNode(test, 'p', 'paragraph');
