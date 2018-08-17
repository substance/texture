import {
  ValueComponent
} from '../../kit'

export default class LanguageEditor extends ValueComponent {
  render ($$) {
    const model = this.props.model
    const value = model.getValue()
    const languages = this._getArticleLanguages()
    let el = $$('div').addClass('sc-language-editor')

    const languageSelector = $$('select').addClass('se-select')
      .ref('input')
      .on('change', this._setLanguage)

    languageSelector.append(
      $$('option').append(this.getLabel('select-language'))
    )

    Object.keys(languages).forEach(lang => {
      const option = $$('option').attr({value: lang}).append(languages[lang])
      if (lang === value) option.attr({selected: 'selected'})
      languageSelector.append(option)
    })

    el.append(languageSelector)

    return el
  }

  _setLanguage () {
    const model = this.props.model
    const input = this.refs.input
    const value = input.getValue()
    model.setValue(value)
  }

  _getArticleLanguages () {
    const configurator = this.context.configurator
    return configurator.getAvailableLanguages()
  }
}
