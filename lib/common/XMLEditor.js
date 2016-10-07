import { Component } from 'substance'

class XMLEditor extends Component {

  getXML() {
    return this.refs.xml.val()
  }

  render($$) {
    let el = $$('div').addClass('sc-xml-editor')

    el.append(
      $$('textarea')
        .ref('xml')
        .append(this.props.xml)
    )
    return el
  }

}

export default XMLEditor
