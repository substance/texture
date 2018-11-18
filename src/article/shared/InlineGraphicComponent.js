import { NodeComponent } from '../../kit'

export default class InlineGraphicComponent extends NodeComponent {
  render ($$) {
    const node = this.props.node
    let url = node.getAttribute('xlink:href')
    let urlResolver = this.context.urlResolver
    if (urlResolver) {
      url = urlResolver.resolveUrl(url)
    }
    const el = $$('span').addClass('sc-inline-graphic').append(
      $$('img').attr({src: url}).ref('image')
    )
    if (this.props.isolatedNodeState) {
      el.addClass('sm-' + this.props.isolatedNodeState)
    }
    return el
  }
}
