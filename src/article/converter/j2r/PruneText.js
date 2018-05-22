import pruneText from '../util/pruneText'
import TextureArticle from '../../TextureArticle'

/*
  Removes all native TextNodes from elements which we specified to be
  not-mixed.
*/
export default class PruneText {

  import(dom) {
    pruneText(dom.find('article'), TextureArticle)
  }

  export() {
    // nothing
  }
}
