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

  didMount() {
    super.didMount()

    const articleMeta = this.props.node
    let titleGroup = articleMeta.findChild('title-group')
    if (titleGroup) {
      this.context.editorSession.onRender('document', this.rerender, this, { path: [titleGroup.id]})
    }
    let transAbstractGroup = articleMeta.findChild('trans-abstract-group')
    if (transAbstractGroup) {
      this.context.editorSession.onRender('document', this.rerender, this, { path: [transAbstractGroup.id]})
    }
  }

  dispose() {
    super.dispose()
  }

  render($$) {
    let el = $$('div').addClass('sc-translations')
    el.append(
      this._renderTitleTranslations($$),
      this._renderAbstractTranslations($$)
    )
    return el
  }

  _renderTitleTranslations($$) {
    const articleMeta = this.props.node
    const transTitleGroups = articleMeta.findAll('title-group > trans-title-group')
    let el = $$('div').addClass('se-title-translations')
    el.append($$('div').addClass('se-translation-header').append('Title Translations'))
    transTitleGroups.forEach((transTitleGroup) => {
      el.append(this._renderTitleEditor($$, transTitleGroup))
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
    let transAbstractGroup = articleMeta.findChild('trans-abstract-group')
    let el = $$('div').addClass('se-abstract-translations')
    if (transAbstractGroup) {
      let transAbstracts = transAbstractGroup.getChildren()
      el.append($$('div').addClass('se-translation-header').append('Abstract Translations'))
      transAbstracts.forEach(transAbstract => {
        el.append(this._renderAbstractEditor($$, transAbstract))
      })
    }
    el.append(
      $$('button').addClass('se-add-translation')
        .append('Add Abstract Translation')
        .on('click', this._addAbstractTranslation)
    )
    return el
  }

  _renderLanguageSelector($$, node) {
    let currentLanguage = node.getAttribute('xml:lang')
    let el = $$('select').addClass('se-language-selector')
      .append(
        $$('option').attr({disabled: 'disabled', selected: 'selected'})
          .append('Select language...')
      )
      .on('change', this._onLanguageChange.bind(this, node))
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

  _renderTitleEditor($$, transTitleGroup) {
    const TextPropertyEditor = this.getComponent('text-property-editor')
    let transTitle = transTitleGroup.findChild('trans-title')
    let el = $$('div').addClass('se-translation')
    // TODO: add support for subtitles
    el.append(
      $$('div').addClass('se-options').append(
        this._renderLanguageSelector($$, transTitleGroup),
        $$('div').addClass('se-remove-translation').append(
          $$(Icon, { icon: 'fa-trash' })
        ).on('click', this._removeTitleTranslation.bind(this, transTitleGroup.id))
      ),
      $$(TextPropertyEditor, {
        placeholder: 'Enter title translation',
        path: transTitle.getTextPath(),
        disabled: this.props.disabled
      }).ref(transTitle.id)
    )
    return el
  }

  _renderAbstractEditor($$, transAbstract) {
    const ContainerEditor = this.getComponent('container')
    let el = $$('div').addClass('se-translation')
    let abstractContent = transAbstract.findChild('abstract-content')
    let transEl = $$('div')
      .addClass('sc-abstract-translation')
      .attr('data-id', transAbstract.id)
    transEl.append(
      $$(ContainerEditor, {
        placeholder: 'Enter abstract translation',
        node: abstractContent,
        disabled: this.props.disabled
      }).ref(abstractContent.id)
    )
    el.append(
      $$('div').addClass('se-options').append(
        this._renderLanguageSelector($$, transAbstract),
        $$('div').addClass('se-remove-translation').append(
          $$(Icon, { icon: 'fa-trash' })
        ).on('click', this._removeAbstractTranslation.bind(this, transAbstract.id))
      ),
      transEl
    )

    return el
  }

  _addTitleTranslation() {
    const editorSession = this.context.editorSession
    editorSession.transaction((doc) => {
      let titleGroup = doc.find('article-meta > title-group')
      let transTitleGroup = doc.createElement('trans-title-group')
      transTitleGroup.append(doc.createElement('trans-title'))
      titleGroup.append(transTitleGroup)
    })
  }

  _addAbstractTranslation() {
    const editorSession = this.context.editorSession
    editorSession.transaction((doc) => {
      let abstractGroup = doc.find('article-meta > trans-abstract-group')
      let abstract = doc.createElement('trans-abstract')
      let abstractContent = doc.createElement('abstract-content')
      let abstractContentPlaceholder = doc.createElement('p')
      abstractContent.append(abstractContentPlaceholder)
      abstract.append(abstractContent)
      abstractGroup.append(abstract)
    })
  }

  _removeTitleTranslation(nodeId) {
    const editorSession = this.context.editorSession
    editorSession.transaction((doc) => {
      let titleGroup = doc.get('article-meta > title-group')
      let title = doc.get(nodeId)
      titleGroup.removeChild(title)
    })
  }

  _removeAbstractTranslation(nodeId) {
    const editorSession = this.context.editorSession
    editorSession.transaction((doc) => {
      let abstractGroup = doc.find('article-meta > trans-abstract-group')
      let transAbstract = doc.get(nodeId)
      abstractGroup.removeChild(transAbstract)
    })
  }

  _onLanguageChange(node, e) {
    let value = e.target.value
    node.setAttribute('xml:lang', value)
  }

}
