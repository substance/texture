import Component from 'substance/ui/Component'

/*
  Takes a path to an XML string and makes it editable
*/
class EditXML extends Component {

  render($$) {
    var documentSession = this.context.documentSession
    var doc = documentSession.getDocument()
    var xml = doc.get(this.props.path)
    return (
      <div class="sc-edit-xml">
        <textarea ref="xml">{xml}</textarea>
        <button onclick={this._save}>Save</button>
      </div>
    )
  }

  _save() {
    var newXML = this.refs.xml.val()
    var path = this.props.path
    var documentSession = this.context.documentSession

    documentSession.transaction(function(tx) {
      tx.set(path, newXML)
    })
    this.send('xmlSaved', newXML)
  }

}

export default EditXML
