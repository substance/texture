import { Vfs } from '../../dar'
import { EMPTY_JATS } from '../ArticleConstants'

export default function createDemoVfs (seedXML) {
  let data = {
    'demo/manifest.xml': "<dar>\n  <documents>\n    <document id=\"manuscript\" type=\"article\" path=\"manuscript.xml\" />\n  </documents>\n  <assets>\n  </assets>\n</dar>\n", //eslint-disable-line
    'demo/manuscript.xml': EMPTY_JATS
  }
  return new Vfs(data)
}
