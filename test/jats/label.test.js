'use strict';

var test = require('./test').module('jats/label');
var testTextNode = require('./testTextNode');

var withAttributes =
  '<label id="lbl1" alt="x" xml:base="y" xml:lang="z">Hypothesis 1</label>';

test.attributesConversion(withAttributes, 'label');

testTextNode(test, 'label', 'label');
