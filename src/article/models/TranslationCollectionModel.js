export default class TranslationCollectionModel {
  constructor (api) {
    this._api = api
  }

  get id () {
    return 'translations'
  }

  get type () {
    return 'translations'
  }

  get isCollection () {
    return true
  }

  getItems () {
    return this._api.getTranslatables()
  }
}
