import { Component, FontAwesomeIcon } from 'substance'
import { FormRowComponent } from '../../kit'

export default class TranslateableEditor extends Component {
  render ($$) {
    const model = this.props.model
    const originalModel = model.getOriginalModel()
    const languages = this._getArticleLanguages()
    const availableLanguages = this._getAvailableLanguages()
    let ModelEditor = this.getComponent(originalModel.type)

    let el = $$('div')
      .addClass('sc-translatable-editor')
      .attr('data-id', model.id)

    el.append(
      $$('div').addClass('se-header').append(this.getLabel(model.id))
    )

    let originalRow = $$(FormRowComponent, {
      label: this.getLabel('original-translation')
    })
    originalRow.append(
      $$(ModelEditor, {
        model: originalModel,
        label: model.name
      })
    )
    el.append(originalRow)

    model.getTranslations().forEach(translation => {
      let lang = translation.getLanguageCode()
      let langName = languages[lang]
      let translationModel = translation.getModel()
      let translRow = $$(FormRowComponent, {
        label: langName
      })
      translRow.append(
        $$(ModelEditor, {
          model: translationModel,
          label: model.name,
          // TODO: use label here?
          placeholder: 'Enter ' + model.name
        })
      )
      el.append(
        translRow.append(
          $$('div').addClass('se-remove').append(
            $$(FontAwesomeIcon, { icon: 'fa-remove' }).addClass('se-icon')
          ).on('click', this._removeTranslation.bind(this, translation))
        )
      )
    })

    if (availableLanguages.length > 0) {
      let footerEl = $$('div').addClass('se-footer')

      if (this.state.dropdown) {
        footerEl.append(this._renderLanguageDropdown($$))
      } else {
        footerEl.append(
          $$('div').addClass('se-control').append(
            this.getLabel('add-translation')
          ).on('click', this._toggleDropdown)
        )
      }

      el.append(footerEl)
    }

    return el
  }

  _renderLanguageDropdown ($$) {
    const languages = this._getArticleLanguages()
    const availableLanguages = this._getAvailableLanguages()

    const el = $$('select').addClass('se-select')
      .on('change', this._addTranslation)

    el.append(
      $$('option').append(this.getLabel('select-language'))
    )

    availableLanguages.forEach(lang => {
      el.append(
        $$('option').attr({value: lang}).append(languages[lang])
      )
    })

    return el
  }

  _addTranslation (e) {
    const value = e.target.value
    const model = this.props.model
    model.addTranslation(value)

    this._toggleDropdown()
  }

  _removeTranslation (translationModel) {
    const model = this.props.model
    model.removeTranslation(translationModel)
  }

  _toggleDropdown () {
    const dropdown = this.state.dropdown
    this.extendState({dropdown: !dropdown})
  }

  _getArticleLanguages () {
    const configurator = this.context.configurator
    return configurator.getAvailableLanguages()
  }

  _getAvailableLanguages () {
    const model = this.props.model
    const languages = this._getArticleLanguages()
    const languageCodes = Object.keys(languages)
    const alreadyTranslated = model.getTranslations().map(t => t.getLanguageCode())
    // HACK: english is hardcoded here as original language
    // we will need to use default lang setting from article level
    alreadyTranslated.push('en')
    return languageCodes.filter(l => !alreadyTranslated.find(t => t === l))
  }
}
