import { module } from './test'

const test = module('jats/table-wrap')

// ATTENTION: table-wraps are not fully covered
var withAttributes =
  '<table-wrap id="mytablewrap"'+
  '   specific-use="test" position="float"'+
  '   xml:base="test-base" xml:lang="testlang">'+
  '</table-wrap>';
test.attributesConversion(withAttributes, 'table-wrap');
