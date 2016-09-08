import { Document } from 'substance'

class TextureArticle extends Document {
  /*
    Get first RefList
  */
  getRefList() {
    var refLists = this.getIndex('type').get('ref-list');
    var refListId = Object.keys(refLists)[0];
    return refListId ? this.get(refListId) : undefined;
  }

  /*
    Get first ContribGroup
  */
  getContribGroup() {
    var contribGroups = this.getIndex('type').get('contrib-group');
    var contribGroupId = Object.keys(contribGroups)[0];
    return contribGroupId ? this.get(contribGroupId) : undefined;
  }
}

export default TextureArticle
