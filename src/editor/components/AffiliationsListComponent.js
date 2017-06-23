import { Component } from 'substance'

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
    const affs = affiliations.map(aff => { return aff.getTextContent() })
    
    let el = $$('div').addClass('sc-affiliations-list')
      .append(affs.join('; '))

    return el
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

}