import { module } from './test'

const test = module('jats/superscript')

var withAttributes =
  '<sup id="mysuperscript"'+
  '   specific-use="test" arrange="test-arrange" xml:base="test-base">'+
  '</sup>';
test.attributesConversion(withAttributes, 'superscript');
