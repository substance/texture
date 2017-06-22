import { NodeComponent, FontAwesomeIcon as Icon } from 'substance'

const languages = {
  cz: 'Czech',
  de: 'German',
  es: 'Spanish',
  fr: 'French'
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
    let translations = transTitleGroup.childNodes
    let el = $$('div').addClass('se-title-translations')
    el.append($$('div').addClass('se-translation-header').append('Title Translations'))
    translations.forEach(nodeId => {
      el.append(this._renderTitleEditor($$, nodeId))
    })

    el.append(
      $$('button').addClass('se-add-translation')
        .append('Add Title Translation')
        .on('click', this._addTitleTranslation)
    )

    return el
  }

  _renderAbstractTranslations($$) {
    let articleMeta = this.props.node
    let transAbstractGroup = articleMeta.find('trans-abstract-group')
    let translations = transAbstractGroup.childNodes
    let el = $$('div').addClass('se-abstract-translations')
    el.append($$('div').addClass('se-translation-header').append('Abstract Translations'))
    translations.forEach(nodeId => {
      el.append(this._renderAbstractEditor($$, nodeId))
    })

    el.append(
      $$('button').addClass('se-add-translation')
        .append('Add Abstract Translation')
        .on('click', this._addAbstractTranslation)
    )

    return el
  }

  _renderLanguageSelector($$, node) {
    let currentLanguage = node.getAttribute('xml:lang')
    let el = $$('select').addClass('se-language-selector').append(
      $$('option').attr({disabled: 'disabled', selected: 'selected'}).append('Select language...')
    ).on('change', this._onLanguageChange.bind(this, node))

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
          $$(Icon, { icon: 'fa-trash' })
        ).on('click', this._removeTitleTranslation.bind(this, node.id))
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
          $$(Icon, { icon: 'fa-trash' })
        ).on('click', this._removeAbstractTranslation.bind(this, node.id))
      ),
      $$(Abstract, {
        node: node,
        disabled: this.props.disabled
      }).ref(node.id)
    )

    return el
  }

  _addTitleTranslation() {
    const articleMeta = this.props.node
    const transTitleGroup = articleMeta.find('title-group trans-title-group')
    const editorSession = this.context.editorSession

    editorSession.transaction((doc) => {
      let titleGroup = doc.get(transTitleGroup.id)
      let title = doc.createElement('trans-title')
      titleGroup.append(title)
    })

    this.rerender()
  }

  _addAbstractTranslation() {
    const articleMeta = this.props.node
    const transAbstractGroup = articleMeta.find('trans-abstract-group')
    const editorSession = this.context.editorSession

    editorSession.transaction((doc) => {
      let abstractGroup = doc.get(transAbstractGroup.id)
      let abstract = doc.createElement('trans-abstract')
      let abstractContent = doc.createElement('abstract-content')
      let abstractContentPlaceholder = doc.createElement('p')
      abstractContent.append(abstractContentPlaceholder)
      abstract.append(abstractContent)
      abstractGroup.append(abstract)
    })

    this.rerender()
  }

  _removeTitleTranslation(nodeId) {
    const articleMeta = this.props.node
    const transTitleGroup = articleMeta.find('title-group trans-title-group')
    const editorSession = this.context.editorSession

    editorSession.transaction((doc) => {
      let titleGroup = doc.get(transTitleGroup.id)
      let title = titleGroup.find(`trans-title#${nodeId}`)
      titleGroup.removeChild(title)
    })

    this.rerender()
  }

  _removeAbstractTranslation(nodeId) {
    const articleMeta = this.props.node
    const transAbstractGroup = articleMeta.find('trans-abstract-group')
    const editorSession = this.context.editorSession

    editorSession.transaction((doc) => {
      let abstractGroup = doc.get(transAbstractGroup.id)
      let abstract = abstractGroup.find(`trans-abstract#${nodeId}`)
      abstractGroup.removeChild(abstract)
    })

    this.rerender()
  }

  _onLanguageChange(node, e) {
    let value = e.target.value
    node.setAttribute('xml:lang', value)
  }

}
