'use strict';

var test = require('./test').module('jats/monospace');

var withAttributes =
  '<monospace id="mymonospace"'+
    'specific-use="test" toggle="test-toggle" xml:base="test-base">'+
  '</bold>';
test.attributesConversion(withAttributes, 'monospace');
