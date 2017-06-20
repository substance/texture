import { NodeComponent } from 'substance'

export default class FigComponent extends NodeComponent {

  didMount() {
    super.didMount()
    this.context.labelGenerator.on('labels:generated', this._onLabelsChanged, this)
  }

  dispose() {
    super.dispose()
    this.context.labelGenerator.off(this)
  }

  render($$) {
    const node = this.props.node
    const labelGenerator = this.context.labelGenerator

    let el = $$('div')
      .addClass('sc-fig')
      .attr('data-id', node.id)

    let label = labelGenerator.getLabel('fig', [node.id])
    let labelEl = $$('div').addClass('se-label').text(label)
    el.append(labelEl)

    const graphic = node.findChild('graphic')
    let graphicEl
    if (graphic) {
      graphicEl = $$(this.getComponent('graphic'), {
        node: graphic,
        disabled: this.props.disabled
      })
      el.append(graphicEl.ref('graphic'))
    }

    const title = node.findChild('title')
    let titleEl = $$(this.getComponent('text-property-editor'), {
      path: title.getTextPath(),
      disabled: this.props.disabled
    }).addClass('se-title').ref('figTitle')
    el.append(titleEl)

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

  _onLabelsChanged(refType) {
    if (refType === 'fig') {
      this.rerender()
    }
  }

}
