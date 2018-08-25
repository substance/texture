import ContentNodeCollection from './ContentNodeCollection'

export default class FigureCollectionModel extends ContentNodeCollection {
  get id () {
    return 'figures'
  }

  get type () {
    return 'figures'
  }

  _getSelector () {
    return 'figure'
  }
}
