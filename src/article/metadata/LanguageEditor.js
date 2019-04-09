import { ValueComponent } from '../../kit'

// TODO: this should come from settings (not configuration)
const LANGUAGES = {
  'en': 'English',
  'es': 'Spanish',
  'pt': 'Portugese',
  'fr': 'French'
}

export default class LanguageEditor extends ValueComponent {
  render ($$) {
    const model = this.props.model
    const value = model.getValue()
    const languages = LANGUAGES
    let el = $$('div').addClass('sc-language-editor')

    const languageSelector = $$('select').addClass('se-select')
      .ref('input')
      .on('click', this._suppressClickPropagation)
      .on('change', this._setLanguage)

    languageSelector.append(
      $$('option').append(this.getLabel('select-language'))
    )

    Object.keys(languages).forEach(lang => {
      const option = $$('option').attr({ value: lang }).append(languages[lang])
      if (lang === value) option.attr({ selected: 'selected' })
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

  _suppressClickPropagation (e) {
    e.stopPropagation()
  }
}
