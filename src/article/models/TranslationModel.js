import {
  TextModel, FlowContentModel
} from '../../kit'

export default class TranslationModel {
  /*
    @param {ArticleAPI} api
    @param {TextTranslation|ContainerTranslation} node
  */
  constructor (api, node) {
    this._api = api
    this._node = node
  }

  get id () {
    return this._node.id
  }

  get type () {
    return 'translation'
  }

  getLanguageCode () {
    return this._node.language
  }

  getModel () {
    let model
    if (this._node.isText()) {
      model = new TextModel(this._api, this._node.getPath())
    } else {
      model = new FlowContentModel(this._api, this._node.getContentPath())
    }
    return model
  }
}
