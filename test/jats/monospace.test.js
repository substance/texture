import { module } from './test'

const test = module('jats/monospace')

var withAttributes =
  '<monospace id="mymonospace"'+
  '   specific-use="test" toggle="test-toggle" xml:base="test-base">'+
  '</monospace>';
test.attributesConversion(withAttributes, 'monospace');
