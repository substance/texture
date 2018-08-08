/*
  EXPERIMENTAL
  Model for a specific translation.
*/
export default class TranslationModel {
  /*
    @param {ArticleAPI} api
    @param {TextModel} text
    @param {string} translatableId id of the translatable this belongs to
    @param {StringModel} languageCode model for the language code of the language this translation is written in
  */
  constructor (api, translatableId, textModel, languageCodeModel) {
    this._api = api
    this._translateableId = this._translateableId
    this._languageCode = languageCodeModel
    this._text = textModel
  }

  // TODO: is it really cool to have a dynamic id?
  get id () {
    return this._translateableId + '_' + this._languageCode.getValue()
  }

  get type () {
    return 'translation'
  }

  getLanguageCode () {
    return this._languageCode
  }

  getText () {
    return this._text
  }
}
