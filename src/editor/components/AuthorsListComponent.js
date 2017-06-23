import { Component } from 'substance'

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
    const authors = contribs.map(contrib => { return contrib.getTextContent() })
    
    let el = $$('div').addClass('sc-authors-list')
      .append(authors.join(', '))

    return el
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

}