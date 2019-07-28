import { DefaultDOMElement } from 'substance'
import { Vfs } from '../../dar'
import { EMPTY_JATS } from '../ArticleConstants'

export default function createDemoVfs () {
  let dom = DefaultDOMElement.parseXML(EMPTY_JATS)
  // add an empty paragraph into the empty body
  let $$ = dom.createElement.bind(dom)
  let bodyEl = dom.find('body')
  bodyEl.append(
    $$('p').attr('id', 'p-1').text('')
  )
  let manuscriptXML = dom.serialize()
  let data = {
    'demo/manifest.xml': "<dar>\n  <documents>\n    <document id=\"manuscript\" type=\"article\" path=\"manuscript.xml\" />\n  </documents>\n  <assets>\n  </assets>\n</dar>\n", //eslint-disable-line
    'demo/manuscript.xml': manuscriptXML
  }
  return new Vfs(data)
}
