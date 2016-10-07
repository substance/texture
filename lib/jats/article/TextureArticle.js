import { Document } from 'substance'

class TextureArticle extends Document {
  /*
    Get first RefList
  */
  getRefList() {
    let refLists = this.getIndex('type').get('ref-list')
    let refListId = Object.keys(refLists)[0]
    return refListId ? this.get(refListId) : undefined
  }

  /*
    Get first ContribGroup
  */
  getContribGroup() {
    let contribGroups = this.getIndex('type').get('contrib-group')
    let contribGroupId = Object.keys(contribGroups)[0]
    return contribGroupId ? this.get(contribGroupId) : undefined
  }
}

export default TextureArticle
