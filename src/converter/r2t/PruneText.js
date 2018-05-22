import pruneText from '../util/pruneText'
import { InternalArticle } from '../../article'

/*
  Removes all native TextNodes from elements which we specified to be
  not-mixed.
*/
export default class PruneText {

  import(dom) {
    pruneText(dom.find('article'), InternalArticle)
  }

  export() {
    // nothing
  }
}
