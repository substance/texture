import Component from 'substance/ui/Component'
import clone from 'lodash/clone'
import Modal from 'substance/ui/Modal'
import Prompt from 'substance/ui/Prompt'
import EditXML from './EditXML'
import deleteSelection from 'substance/model/transform/deleteSelection'

/*
  Prompt shown when an unsupported node is selected.
*/
class UnsupportedInlineNodeTool extends Component {

  constructor(...args) {
    super(...args)

    this.handleActions({
      'closeModal': this._closeModal,
      'xmlSaved': this._closeModal
    })
  }

  render($$) {
    const node = this.props.node
    let el = (
      <div class="sc-unsupported-node-tool">
      </div>
    )
    el.append(
      <Prompt>
        <Prompt.Label label="Unsupported Element" />
        <Prompt.Separator />
        <Prompt.Action name="edit" title="Edit XML"
          onclick={this._onEdit} />
        <Prompt.Action name="delete" title="Delete Element"
          onclick={this._onDelete} />
      </Prompt>
    )
    if (this.state.editXML) {
      el.append(
        <Modal width="medium">
          <EditXML path={[node.id, 'xml']} />
        </Modal>
      )
    }
    return el
  }

  _closeModal() {
    this.setState({
      editXML: false
    })
  }

  _onEdit() {
    this.setState({
      editXML: true
    })
  }

  _onDelete() {
    var ds = this.context.documentSession
    ds.transaction(function(tx, args) {
      return deleteSelection(tx, args)
    })
  }

}

UnsupportedInlineNodeTool.static.getProps = function(commandStates) {
  if (commandStates['unsupported-inline'].active) {
    return clone(commandStates['unsupported-inline'])
  } else {
    return undefined
  }
}

UnsupportedInlineNodeTool.static.name = 'unsupported-inline'

export default UnsupportedInlineNodeTool
