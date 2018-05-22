import { expandAbstract } from './r2tHelpers'
/*
  Expands elements in article-meta which are optional in DarArticle but
  required in InternalArticle.
*/
export default class ConvertArticleMeta {

  import(dom) {
    expandAbstract(dom)
  }

  export() {
    // nothing
  }
}
