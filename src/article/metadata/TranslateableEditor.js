import { Component } from 'substance'
import ContainerModel from '../models/ContainerModel'

export default class TranslateableEditor extends Component {

  render($$) {
    const model = this.props.model
    const originalText = model.getOriginalText()
    const TextPropertyEditor = this.getComponent('text-property')
    const ContainerEditor = this.getComponent('container')
    let el = $$('div')
      .addClass('sc-translatable-editor')
      .attr('data-id', model.id)

    el.append(
      $$('h1').append(this.getLabel(model.id))
    )

    // TODO: Let's improve this code!
    if (originalText instanceof ContainerModel) {

      el.append(
        $$('div').append('Original'),
        $$(ContainerEditor, {
          node: originalText.getContainerNode()
        }).ref(model.id+'Editor')
      )

    } else {
      el.append(
        $$('div').append('Original'),
        $$(TextPropertyEditor, {
          name: model.id+'Editor',
          placeholder: 'Enter text',
          path: originalText.getTextPath()
        }).ref(model.id+'Editor')
      )
    }


    model.getTranslations().forEach(translation => {
      let text = translation.getText()
      let lang = translation.getLanguageCode()

      if (text instanceof ContainerModel) {
        el.append(
          $$('div').append('Original'),
          $$(ContainerEditor, {
            node: text.getContainerNode()
          }).ref(model.id+lang+'Editor')
        )
      } else {
        el.append(
          $$('div').append(lang),
          $$(TextPropertyEditor, {
            name: model.id+lang+'Editor',
            placeholder: 'Enter text',
            path: text.getTextPath()
          }).ref(model.id+lang+'Editor')
        )
      }

    })

    return el
  }
}
