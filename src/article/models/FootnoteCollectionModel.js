import DefaultCollectionModel from './DefaultCollectionModel'

export default class FootnoteCollectionModel extends DefaultCollectionModel {
  _getItemType () {
    return 'fn'
  }
}
