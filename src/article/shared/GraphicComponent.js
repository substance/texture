import { NodeComponent } from '../../kit'

export default class GraphicComponent extends NodeComponent {
  render ($$) {
    const node = this.props.node
    let url = node.getAttribute('xlink:href')
    let urlResolver = this.context.urlResolver
    if (urlResolver) {
      url = urlResolver.resolveUrl(url)
    }
    let el = $$('div')
      .addClass('sc-graphic')
      .attr('data-id', node.id)
    el.append(
      $$('img').attr({src: url}).ref('image')
    )
    return el
  }
}
