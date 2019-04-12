import { DefaultDOMElement } from 'substance'
import { DEFAULT_JATS_SCHEMA_ID, DEFAULT_JATS_DTD } from '../../ArticleConstants'

// TODO: we need a way to specify which namespaces should be declared

const EMPTY_JATS = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE article PUBLIC "${DEFAULT_JATS_SCHEMA_ID}" "${DEFAULT_JATS_DTD}">
<article xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ali="http://www.niso.org/schemas/ali/1.0">
  <front>
    <article-meta>
      <title-group>
        <article-title></article-title>
      </title-group>
      <abstract>
      </abstract>
    </article-meta>
  </front>
  <body>
  </body>
  <back>
  </back>
</article>`

export default function createEmptyJATS () {
  return DefaultDOMElement.parseXML(EMPTY_JATS)
}
