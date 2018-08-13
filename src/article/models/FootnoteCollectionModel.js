export default class FootnoteCollectionModel {
  constructor (api) {
    this._api = api
  }

  get id () {
    return 'footnotes'
  }

  get isCollection () {
    return true
  }

  getItems () {
    return this._api.getFootnotes()
  }

  addItem (item) { // eslint-disable-line no-unused-vars
    // TODO: adding a figure like this would be possible in a classical Substance Data model
    // but it is not clear how to persist this in the JATS XML model
  }

  removeItem (item) { // eslint-disable-line no-unused-vars
    // TODO: should it really be possible to delete a figure here?
  }
}
