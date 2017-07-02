import { NodeComponent } from 'substance'

export default class SigBlockComponent extends NodeComponent {

  render($$) {
    const sigBlock = this.props.node
    const TextNode = this.getComponent('text-node')

    let el = $$('div').addClass('sc-sig-block')
    el.append($$(this.getComponent('separator'), {
      label: 'sig-block-start'
    }))

    let sigs = sigBlock.findAll('sig')
    sigs.forEach((sig) => {
      // TODO: we need a UI concept
      // for now this can only be edited, not created
      el.append($$(TextNode, {
        node: sig,
        disabled: this.props.disabled
      }))
    })

    el.append($$(this.getComponent('separator'), {
      label: 'sig-block-start'
    }))

    return el
  }

}