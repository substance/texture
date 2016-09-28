import { module } from './test'

const test = module('jats/ext-link')

var withAttributes =
  '<ext-link id="mybold"'+
  '   ext-link-type="link"'+
  '   specific-use="test" assigning-authority="authority"'+
  '   xmlns:xlink="xlink" xlink:actuate="actuate" xlink:href="url"'+
  '   xlink:role="role" xlink:show="show" xlink:title="title"'+
  '   xlink:type="role"'+
  '   xml:base="test-base" xml:lang="testlang">'+
  '</ext-link>';
test.attributesConversion(withAttributes, 'ext-link');
