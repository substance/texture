import Component from 'substance/ui/Component'

class XMLEditor extends Component {

  render($$) {
    return (
      <div class="sc-xml-editor">
        <textarea ref="xml">{this.props.xml}</textarea>
      </div>
    )
  }

  getXML() {
    return this.refs.xml.val()
  }

}

export default XMLEditor
