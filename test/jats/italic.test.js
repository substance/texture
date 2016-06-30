'use strict';

var test = require('./test').module('jats/italic');

var withAttributes =
  '<italic id="myitalic"'+
    'specific-use="test" toggle="test-toggle" xml:base="test-base">'+
  '</bold>';
test.attributesConversion(withAttributes, 'italic');
