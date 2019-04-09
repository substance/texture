import pruneText from '../util/pruneText'
import TextureArticleSchema from '../../TextureJATS'

/*
  Removes all native TextNodes from elements which we specified to be
  not-mixed.
*/
export default class PruneText {
  import (dom) {
    pruneText(dom.find('article'), TextureArticleSchema)
  }

  export () {
    // nothing
  }
}
