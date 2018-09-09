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

    if (this.state.errored) {
      el.append(
        $$('div').addClass('se-error').append(
          this.context.iconProvider.renderIcon($$, 'graphic-load-error').addClass('se-icon'),
          this.getLabel('graphic-load-error')
        )
      )
      return el
    }

    el.append(
      $$('img').attr({src: url}).ref('image')
        .on('error', this._onLoadError)
    )
    return el
  }

  _onLoadError () {
    this.extendState({errored: true})
  }
}
