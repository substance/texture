import { Component, FontAwesomeIcon, without } from 'substance'
import ContainerModel from '../models/ContainerModel'
import FormRowComponent from './FormRowComponent'

export default class TranslateableEditor extends Component {

  render($$) {
    const model = this.props.model
    const originalText = model.getOriginalText()
    const TextPropertyEditor = this.getComponent('text-property')
    const ContainerEditor = this.getComponent('container')
    const languages = this._getArticleLanguages()
    const availableLanguages = this._getAvailableLanguages()

    let el = $$('div')
      .addClass('sc-translatable-editor')
      .attr('data-id', model.id)

    el.append(
      $$('div').addClass('se-header').append(this.getLabel(model.id))
    )

    const originalRow = $$(FormRowComponent, {
      label: this.getLabel('original-translation')
    })

    // TODO: Let's improve this code!
    if (originalText instanceof ContainerModel) {
      originalRow.append(
        $$(ContainerEditor, {
          node: originalText.getContainerNode()
        }).ref(model.id+'Editor')
      )
    } else {
      originalRow.append(
        $$(TextPropertyEditor, {
          name: model.id+'Editor',
          placeholder: 'Enter text',
          path: originalText.getTextPath()
        }).ref(model.id+'Editor')
      )
    }

    el.append(originalRow)

    model.getTranslations().forEach(translation => {
      let text = translation.getText()
      let lang = translation.getLanguageCode()
      let langName = languages[lang]

      const translRow = $$(FormRowComponent, {
        label: langName
      })

      if (text instanceof ContainerModel) {
        translRow.append(
          $$(ContainerEditor, {
            node: text.getContainerNode()
          }).ref(model.id+lang+'Editor')
        )
      } else {
        translRow.append(
          $$(TextPropertyEditor, {
            name: model.id+lang+'Editor',
            placeholder: 'Enter text',
            path: text.getTextPath()
          }).ref(model.id+lang+'Editor')
        )
      }

      el.append(
        translRow.append(
          $$('div').addClass('se-remove').append(
            $$(FontAwesomeIcon, { icon: 'fa-chevron-down' }).addClass('se-icon')
          ).on('click', this._removeLanguage.bind(this, lang))
        )
      )
    })

    if(availableLanguages.length > 0) {
      let footerEl = $$('div').addClass('se-footer')

      if(this.state.dropdown) {
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

  _renderLanguageDropdown($$) {
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

  _addTranslation(e) {
    const value = e.target.value
    const model = this.props.model
    model.addTranslation(value)
    
    this._toggleDropdown()
  }

  _removeLanguage(lang) {
    const model = this.props.model
    model.removeTranslation(lang)
  }

  _toggleDropdown() {
    const dropdown = this.state.dropdown
    this.extendState({dropdown: !dropdown})
  }

  _getArticleLanguages() {
    const configurator = this.context.configurator
    return configurator.getAvailableLanguages()
  }

  _getAvailableLanguages() {
    const model = this.props.model
    const languages = this._getArticleLanguages()
    const languageCodes = Object.keys(languages)
    const alreadyTranslated = model.getTranslations().map(t => t.getLanguageCode())
    // HACK: english is hardcoded here as original language
    // we will need to use default lang setting from article level 
    return without(languageCodes, alreadyTranslated, 'en')
  }
}
