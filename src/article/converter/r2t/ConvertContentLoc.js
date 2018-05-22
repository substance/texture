import { importContentLoc, exportContentLoc } from './r2tHelpers'
export default class ConvertContentLoc {

  /*
    Collect <fpage>,<lpage>, <page-range>, or <elocation-id> from
    <article-meta>, and wrap them into <publication-loc>
  */
  import(dom) {
    let articleMeta = dom.find('front > article-meta')
    importContentLoc(articleMeta, dom)
  }

  export(dom) {
    let articleMeta = dom.find('front > article-meta')
    exportContentLoc(articleMeta)
  }
}
