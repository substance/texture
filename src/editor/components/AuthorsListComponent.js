import { Component, TextPropertyEditor } from 'substance'

export default class AuthorsListComponent extends Component {

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
    const contribs = articleMeta.findAll('string-contrib')
    let els = [];

    let contribsEls = contribs.map(contrib => {
      return $$(TextPropertyEditor, {
        placeholder: 'Enter author name',
        path: contrib.getTextPath(),
        disabled: this.props.disabled,
        tagName: 'span'
      }).addClass('se-author')
    })

    // Separate contributors with a comma
    // TODO this should be translatable
    for (let contribsEl of contribsEls) {
      els.push(contribsEl, $$('span').append(',').addClass('se-separator'))
    }
    els = els.slice(0, -1)

    return $$('div').addClass('sc-authors-list')
      .append(els)
      .on('click', this._editContributors)
  }

  _onDocumentChange(change) {
    let updatedProps = Object.keys(change.updated)
    let updatedPropsString = updatedProps.join('/')
    // We will trigger rerendering if any string-contrib
    // or contrib-group was updated
    if(updatedPropsString.indexOf('string-contrib') > -1 || updatedPropsString.indexOf('contrib-group') > -1) {
      this.rerender()
    }
  }

  _editContributors() {
    this.send('switchContext', {
      contextId: 'contributors',
    })
  }
}
