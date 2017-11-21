import { Component } from 'substance'

export default class ModalLayout extends Component {

  render($$) {
    if (this.props.children.length !== 2) {
      throw new Error('ModalLayout only works with exactly two child elements')
    }

    let el = $$('div').addClass('sc-modal-layout')
    let paneA = this.props.children[0]
    let paneB = this.props.children[1]

    paneA.addClass('se-content')
    paneB.addClass('se-actions')

    el.append(
      paneA,
      paneB
    )
    return el
  }

}
