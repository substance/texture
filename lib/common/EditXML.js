import { Button, Component } from 'substance'
import XMLAttributeEditor from './XMLAttributeEditor'
import XMLEditor from './XMLEditor'

class EditXML extends Component {

  render($$) {
    let node = this.props.node
    let el = $$('div').addClass('sc-edit-xml')
    let tagName = node.tagName || node.constructor.type

    el.append(
      $$('div').addClass('se-tag sm-open-tag-start').append('<'+tagName)
    )

    el.append(
      $$(XMLAttributeEditor, {
        attributes: node.attributes
      }).ref('attributesEditor')
    )

    el.append(
      $$('div').addClass('se-tag sm-open-tag-end').append('>')
    )

    el.append(
      $$(XMLEditor, {
        xml: node.xmlContent
      }).ref('xmlEditor')
    )

    el.append(
      $$('div').addClass('se-tag sm-end-tag').append('</'+tagName+'>')
    )

    el.append(
      $$('div').addClass('se-actions').append(
        $$(Button).append('Save').on('click', this._save),
        $$(Button).addClass('se-cancel').append('Cancel').on('click', this._cancel)
      )
    )
    return el
  }

  _cancel() {
    this.send('closeModal');
  }

  _delete() {
    console.warn('Not yet implemented');
    // TODO: this is actually not very trivial as we don't
    // know the node's context. E.g. when deleting
    // a contrib node we need to remove the id from
  }

  _save() {
    let editorSession = this.context.editorSession
    let node = this.props.node

    let newAttributes = this.refs.attributesEditor.getAttributes()
    let newXML = this.refs.xmlEditor.getXML()

    // TODO: add validity checks. E.g. try to parse XML string
    editorSession.transaction(function(tx) {
      tx.set([node.id, 'xmlContent'], newXML)
      tx.set([node.id, 'attributes'], newAttributes)
    })
    this.send('closeModal')
  }
}

export default EditXML
