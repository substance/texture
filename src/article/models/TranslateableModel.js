import {
  TextModel, FlowContentModel
} from '../../kit'

/*
  A special view on a translatable text inside the document.
*/
export default class TranslateableModel {
  /*
    @param {ArticleAPI} api
    @param {Title|Abstract} node
  */
  constructor (api, node) {
    this._api = api
    this._node = node
  }

  get id () {
    return this._node.id
  }

  get name () {
    // TODO: probably we will need something more sophisticable here
    return this._node.id
  }

  get type () {
    return 'translatable'
  }

  getOriginalModel () {
    let model
    if (this._node.isText()) {
      model = new TextModel(this._api, this._node.getPath())
    } else {
      model = new FlowContentModel(this._api, this._node.getContentPath())
    }
    return model
  }

  /*
    Returns a list of translations
  */
  getTranslations () {
    return this._node.translations.map(id => {
      return this._api.getModelById(id)
    })
  }

  /*
    Creates a new translation (with empty text) for a given language code
  */
  addTranslation (languageCode) {
    this._api.addTranslation(this, languageCode)
  }

  /*
    Removes a translation for a given language code
  */
  removeTranslation (translationModel) {
    this._api.deleteTranslation(this, translationModel)
  }
}
