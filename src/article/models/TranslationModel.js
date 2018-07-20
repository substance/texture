export default class TranslationModel {
  constructor(api, text, translatableId, languageCode) {
    this._api = api 
    this._text = text
    this._translateableId = this._translateableId
    this._languageCode = languageCode
  }

  get id() {
    return this._translateableId + '_' + this._languageCode
  }

  get type() {
    return 'translation'
  }

  getLanguageCode() {
    return this._languageCode
  }

  getText() {
    return this._text
  }

  /*
    Returns original language code
  */
  getOriginalLangageCode() {
    return this._originalLanguageCode
  }

  /*  
    Returns the text model to be translated
  */
  getOriginalText() {
    return this._originalText
  }

}
