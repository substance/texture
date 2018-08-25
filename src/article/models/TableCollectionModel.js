import ContentNodeCollection from './ContentNodeCollection'

export default class TableCollectionModel extends ContentNodeCollection {
  get id () {
    return 'tables'
  }

  get type () {
    return 'tables'
  }

  _getSelector () {
    return 'table-figure'
  }
}
