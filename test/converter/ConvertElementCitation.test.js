import { module } from 'substance-test'
import { DefaultDOMElement } from 'substance'

// TODO: export all trafos via index.es.js, and import {..} from '../../index.es.js'
import ConvertElementCitation from '../../converter/r2t/ConvertElementCitation'

const test = module('Element Citation Converter')
let fixture = vfs.readFileSync('fixture/element-citation.xml')

// All elements that are supported by the editor must be present
// The transformer must create empty elements if they are not in the source
// XML (JATS4R)
const EDITABLE_ELEMENTS = [
  'volume', 'issue', 'chapter-title', 'data-title'
]

test("r2t: Import", function(t) {
  let dom = DefaultDOMElement.parseXML(xml)
  let converter = new ConvertElementCitation()
  converter.import(dom)

  let r1 = dom.find('#r1')
  let contentLoc = r1.find('content-loc')
  // fpage,lpage,page-range should be wrapped in content-loc
  t.equal(contentLoc.attr('type'), 'print', 'Should have a print content-loc')
  t.ok(contentLoc.find('fpage'), 'contentLoc should have an fpage')
  t.ok(contentLoc.find('lpage'), 'contentLoc should have an lpage')
  t.ok(contentLoc.find('page-range'), 'empty page-range element should have been created')

  // should have all possible elements expanded
  t.ok(_hasElements(r1, EDITABLE_ELEMENTS), 'should have all editable elements expanded')
  t.end()
})


function _hasElements(el, elementNames) {
  let result = true
  elementNames.forEach((elementName) => {
    if (!el.find(elementName)) {
      result = false
    }
  })
  return result
}
