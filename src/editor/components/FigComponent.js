import { Component } from 'substance'

export default class FigComponent extends Component {

  render($$) {
    const node = this.props.node

    let el = $$('div')
      .addClass('sc-fig')
      .attr('data-id', node.id)

    const caption = node.findChild('caption')
    let captionEl
    if (caption) {
      captionEl = $$(this.getComponent('caption'), {
        node: caption,
        disabled: this.props.disabled
      })
    } else {
      // TODO: ability to add a caption
      captionEl = $$('div').addClass('sc-abstract').append('TODO: ADD CAPTION')
    }
    el.append(captionEl.ref('abstract'))

    return el
  }
}
