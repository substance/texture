import { Component } from 'substance'
import SelectInput from './SelectInput'

export default class TranslationPropertyEditor extends Component {

  render($$) {
    const property = this.props.property
    const name = property.name
    const data = this.props.model.toJSON()
    const value = data[name]
    const languages = this._getArticleLanguages()

    return $$(SelectInput, {
      name: name,
      value: value,
      warning: this.props.warning,
      availableOptions: Object.keys(languages).map(code=>{return{id:code,text:languages[code]}})
    }).ref(name)
  }

  _getArticleLanguages() {
    const configurator = this.context.configurator
    return configurator.getAvailableLanguages()
  }
}

TranslationPropertyEditor.matches = function(property) {
  return property.type === 'string' && property.name === 'language'
}

