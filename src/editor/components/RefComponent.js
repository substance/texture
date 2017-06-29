import { Component, FontAwesomeIcon as Icon } from 'substance'
import ElementCitationComponent from './ElementCitationComponent'

export default class RefComponent extends Component {
  render($$) {
    let el = $$('div').addClass('sc-ref')
    let ref = this.props.node
    let label = this.context.labelGenerator.getPosition('bibr', ref.id)
    let elementCitation = ref.find('element-citation')

    if (label) {
      el.append(
        $$('div').addClass('se-label').append(
          label
        )
      )
    }

    if (elementCitation) {
      el.append(
        $$(ElementCitationComponent, { node: elementCitation } ).on('click', this._editRef)
      )
    } else {
      console.warn('No element citation found')
    }

    el.append(
      $$('div').addClass('se-remove-ref')
        .append(
          $$(Icon, { icon: 'fa-trash' })
        )
        .on('click', this._removeRef.bind(this, ref.id))
    )
    return el
  }

  _editRef() {
    this.send('switchContext', {
      contextId: 'edit-ref',
      nodeId: this.props.node.id
    })
  }

  _removeRef(refId) {
    this.send('removeRef', refId)
  }
}
