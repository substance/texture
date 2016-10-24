import { Tool, deleteSelection } from 'substance'
import EditXML from '../common/EditXML'

/*
  Prompt shown when an unsupported node is selected.
*/

class UnsupportedInlineNodeTool extends Tool {
  constructor(...args) {
    super(...args)
    this.handleActions({
      'closeModal': this._closeModal,
      'xmlSaved': this._closeModal
    })
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
    let editorSession = this.context.editorSession
    editorSession.transaction(function(tx, args) {
      return deleteSelection(tx, args)
    })
  }

  render($$) {
    let el = $$('div').addClass('sc-unsupported-node-tool')
    let node = this.props.node
    let Modal = this.getComponent('modal')
    let Button = this.getComponent('button')

    el.append(
      $$(Button, {
        icon: 'edit',
        style: this.props.style
      })
      .attr('title', 'Edit XML')
      .on('click', this._onEdit),
      $$(Button, {
        icon: 'delete',
        style: this.props.style
      })
      .attr('title', 'Delete Element')
      .on('click', this._onDelete)
    )

    if (this.state.editXML) {
      el.append(
        $$(Modal, {
          width: 'medium'
        }).append(
          $$(EditXML, {
            node: node
          })
        )
      )
    }
    return el
  }

}

export default UnsupportedInlineNodeTool
