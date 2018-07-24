
/* 
  A special view on a translatable text inside the document
*/

export default class TranslateableModel {
  constructor(api, id, _originalLanguageCode, originalText, translations) {
    this._api = api 
    this._id = id // e.g. title-trans|abstract-trans|figure-caption-1-trans
    this._originalLanguageCode = _originalLanguageCode
    this._originalText = originalText
    this._translations = translations
  }

  get id() {
    return this._id
  }

  get type() {
    return 'translatable'
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

  /*
    Returns a list of translations
  */
  getTranslations() {
    return this._translations
  }

  /*
    Creates a new translation (with empty text) for a given language code
  */
  addTranslation(languageCode) {
    this._api.addTranslation(this._id, languageCode)
  }

}

