import Component from 'substance/ui/Component'
import XMLAttributeEditor from './XMLAttributeEditor'
import XMLEditor from './XMLEditor'
import Button from 'substance/ui/Button'

class EditXML extends Component {

  render($$) {
    var node = this.props.node
    var el = (
      <div class="sc-edit-xml">
        <div class="se-tag sm-open-tag-start">&lt;contrib</div>
        <XMLAttributeEditor attributes={node.attributes} ref="attributesEditor" />
        <div class="se-tag sm-open-tag-end">&gt;</div>
        <XMLEditor xml={node.xmlContent} ref="xmlEditor" />
        <div class="se-tag sm-end-tag">&lt;/contrib&gt;</div>
        <div class ="se-actions">
          <Button onclick={this._save}>Save</Button>
          <Button class="se-cancel" onclick={this._cancel}>Cancel</Button>
          <Button class="se-delete" onclick={this._delete}>Delete</Button>
        </div>
      </div>
    )
    return el
  }

  _cancel() {
    this.send('closeModal')
  }

  _delete() {
    console.warn('Not yet implemented')
    // TODO: this is actually not very trivial as we don't
    // know the node's context. E.g. when deleting
    // a contrib node we need to remove the id from
  }

  _save() {
    var documentSession = this.context.documentSession
    var node = this.props.node

    var newAttributes = this.refs.attributesEditor.getAttributes()
    var newXML = this.refs.xmlEditor.getXML()

    // TODO: add validity checks. E.g. try to parse XML string

    documentSession.transaction(function(tx) {
      tx.set([node.id, 'xmlContent'], newXML)
      tx.set([node.id, 'attributes'], newAttributes)
    })
    this.send('closeModal')
  }
}

export default EditXML
