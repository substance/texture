'use strict';

var test = require('./test').module('jats/title');
import testTextNode from './testTextNode'

var withAttributes =
  '<title id="title1" content-type="x" xml:base="y" specific-use="z">Introduction</title>';

test.attributesConversion(withAttributes, 'title');

testTextNode(test, 'title', 'title');
