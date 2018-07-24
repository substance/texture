import { Component } from 'substance'
import ContainerModel from '../models/ContainerModel'
import FormRowComponent from './FormRowComponent'

export default class TranslateableEditor extends Component {

  render($$) {
    const model = this.props.model
    const originalText = model.getOriginalText()
    const TextPropertyEditor = this.getComponent('text-property')
    const ContainerEditor = this.getComponent('container')
    const languages = this._getAvailableLanguages()

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

      el.append(translRow)
    })

    return el
  }

  _getAvailableLanguages() {
    const configurator = this.context.configurator
    return configurator.getAvailableLanguages()
  }
}
