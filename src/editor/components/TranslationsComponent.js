import { NodeComponent, FontAwesomeIcon as Icon } from 'substance'

const languages = {
  cz: 'Czech',
  de: 'German'
}

/*
  Edit translations for title and abstract
*/
export default class TranslationsComponent extends NodeComponent {

  render($$) {
    let el = $$('div').addClass('sc-translations')
    el.append(
      this._renderTitleTranslations($$),
      this._renderAbstractTranslations($$)
    )
    return el
  }

  _renderTitleTranslations($$) {
    let articleMeta = this.props.node
    let transTitleGroup = articleMeta.find('title-group trans-title-group')
    console.log('transTitleGroup', transTitleGroup)
    let translations = transTitleGroup.childNodes
    let el = $$('div').addClass('se-title-translations')
    el.append($$('div').addClass('se-translation-header').append('Title Translations'))
    translations.forEach(nodeId => {
      el.append(this._renderTitleEditor($$, nodeId))
    })

    return el
  }

  _renderAbstractTranslations($$) {
    let articleMeta = this.props.node
    let transAbstractGroup = articleMeta.find('trans-abstract-group')
    console.log('transAbstractGroup', transAbstractGroup)
    let translations = transAbstractGroup.childNodes
    let el = $$('div').addClass('se-abstract-translations')
    el.append($$('div').addClass('se-translation-header').append('Abstract Translations'))
    translations.forEach(nodeId => {
      el.append(this._renderAbstractEditor($$, nodeId))
    })

    return el
  }

  _renderLanguageSelector($$, node) {
    let currentLanguage = node.getAttribute('xml:lang')
    let el = $$('select').addClass('se-language-selector')
    
    for(let lang in languages) {
      if(languages[lang]) {
        let option = $$('option')
          .attr({value: lang})
          .append(languages[lang])
        if(lang === currentLanguage) option.attr({selected: 'selected'})
        el.append(option)
      }
    }

    return el
  }

  _renderTitleEditor($$, nodeId) {
    let editorSession = this.context.editorSession
    let doc = editorSession.getDocument()
    const node = doc.get(nodeId)
    const TextPropertyEditor = this.getComponent('text-property-editor')
    let el = $$('div').addClass('se-translation')
    
    el.append(
      $$('div').addClass('se-options').append(
        this._renderLanguageSelector($$, node),
        $$('div').addClass('se-remove-translation').append(
          $$(Icon, { icon: 'fa-remove' })
        ).on('click', this._removeTranslation.bind(this, node.id))
      ),
      $$(TextPropertyEditor, {
        history: '',
        path: node.getTextPath(),
        disabled: this.props.disabled
      }).ref(node.id)
    )

    return el
  }

  _renderAbstractEditor($$, nodeId) {
    let editorSession = this.context.editorSession
    let doc = editorSession.getDocument()
    let node = doc.get(nodeId)
    let Abstract = this.getComponent('abstract')
    let el = $$('div').addClass('se-translation')
    
    el.append(
      $$('div').addClass('se-options').append(
        this._renderLanguageSelector($$, node),
        $$('div').addClass('se-remove-translation').append(
          $$(Icon, { icon: 'fa-remove' })
        ).on('click', this._removeTranslation.bind(this, node.id))
      ),
      $$(Abstract, {
        node: node, 
        disabled: this.props.disabled
      }).ref(node.id)
    )

    return el
  }

  _removeTranslation(nodeId) {

  }

}
