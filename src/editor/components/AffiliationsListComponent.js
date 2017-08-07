import { Component, TextPropertyEditor } from 'substance'

export default class AffiliationsList extends Component {

  didMount() {
    super.didMount()
    this.context.editorSession.onRender('document', this._onDocumentChange, this)
  }

  dispose() {
    super.dispose()
    this.context.editorSession.off(this)
  }

  render($$) {
    const articleMeta = this.props.node
    const affiliations = articleMeta.findAll('string-aff')
    let els = [];

    let affiliationsEl = affiliations.map(affiliation => {
      return $$(TextPropertyEditor, {
        placeholder: 'Enter affiliated institution',
        path: affiliation.getTextPath(),
        disabled: this.props.disabled,
        tagName: 'span'
      }).addClass('se-affiliation')
    })

    // Separate affiliations with a semi-colon
    // TODO this should be translatable
    for (let affiliationEl of affiliationsEl) {
      els.push(affiliationEl, $$('span').append(';').addClass('se-separator'))
    }
    els = els.slice(0, -1)

    return $$('div').addClass('sc-affiliations-list')
      .append(els)
      .on('click', this._editAffiliations)
  }

  _onDocumentChange(change) {
    let updatedProps = Object.keys(change.updated)
    let updatedPropsString = updatedProps.join('/')
    // We will trigger rerendering if any string-aff
    // or aff-group were updated
    if(updatedPropsString.indexOf('string-aff') > -1 || updatedPropsString.indexOf('aff-group') > -1) {
      this.rerender()
    }
  }

  _editAffiliations() {
    this.send('switchContext', {
      contextId: 'affiliations',
    })
  }

}
