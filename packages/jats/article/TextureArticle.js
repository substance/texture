'use strict';

var Document = require('substance/model/Document');

class TextureArticle extends Document {
  /*
    Get first RefList
  */
  getRefList() {
    var refLists = this.getIndex('type').get('ref-list');
    var refListId = Object.keys(refLists)[0];
    return refListId ? this.get(refListId) : undefined;
  }
}

module.exports = TextureArticle;
