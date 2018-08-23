import { NodeComponent } from '../../kit'

export default class SigBlockComponent extends NodeComponent {
  render ($$) {
    const sigBlock = this.props.node

    let el = $$('div').addClass('sc-sig-block')
    el.append($$(this.getComponent('separator'), {
      label: 'sig-block-start'
    }))

    let sigs = sigBlock.findAll('sig')

    sigs.forEach((sig) => {
      el.append($$(this.getComponent('container'), {
        node: sig,
        disabled: this.props.disabled
      })).ref(sig.id)
    })

    el.append($$(this.getComponent('separator'), {
      label: 'sig-block-start'
    }))

    return el
  }
}
