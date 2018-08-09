import pruneText from '../util/pruneText'
import InternalArticleSchema from '../article/InternalArticleSchema'

/*
  Removes all native TextNodes from elements which we specified to be
  not-mixed.
*/
export default class PruneText {

  import(dom) {
    pruneText(dom.find('article'), InternalArticleSchema)
  }

  export() {
    // nothing
  }
}
