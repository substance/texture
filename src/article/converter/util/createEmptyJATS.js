import { DefaultDOMElement } from 'substance'

const EMPTY_JATS = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE article PUBLIC "-//NLM//DTD JATS (Z39.96) Journal Archiving DTD v1.0 20120330//EN" "JATS-journalarchiving.dtd">
<article xmlns:xlink="http://www.w3.org/1999/xlink">
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
