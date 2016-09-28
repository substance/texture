import { module } from './test'
import testTextNode from './testTextNode'

const test = module('jats/title')

var withAttributes =
  '<title id="title1" content-type="x" xml:base="y" specific-use="z">Introduction</title>';

test.attributesConversion(withAttributes, 'title');

testTextNode(test, 'title', 'title');
