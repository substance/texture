import { Component } from 'substance'
import EditXML from '../../common/EditXML'
import EditContrib from './EditContrib'
import { getAdapter } from './contribUtils'

class ContribComponent extends Component {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'closeModal': this._closeModal,
      'xmlSaved': this._closeModal
    })

    this.props.node.on('properties:changed', this.rerender, this)
  }

  render($$) {
    let Modal = this.getComponent('modal')
    let contrib = getAdapter(this.props.node)
    let el = $$('div').addClass('sc-contrib')
      .append(
        $$('div').addClass('se-name')
          .append(contrib.fullName)
          .on('click', this._toggleEditor)
      )

    if (this.state.editXML) {
      // Conforms to strict markup enforced by texture
      // for visual editing
      let EditorClass
      if (contrib.strict) {
        EditorClass = EditContrib
      } else {
        EditorClass = EditXML
      }

      el.append(
        $$(Modal, {
          width: 'medium'
        }).append(
          $$(EditorClass, contrib)
        )
      )
    }
    return el
  }

  _closeModal() {
    this.setState({
      editXML: false
    })
  }

  _toggleEditor() {
    this.setState({
      editXML: true
    })
  }

}

export default ContribComponent
