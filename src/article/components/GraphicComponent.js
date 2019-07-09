import { NodeComponent } from '../../kit'

export default class GraphicComponent extends NodeComponent {
  render ($$) {
    const node = this.props.node
    const urlResolver = this.context.urlResolver
    let url = node.href
    if (urlResolver) {
      url = urlResolver.resolveUrl(url)
    }

    let el = $$(this.tagName).addClass(this._getClassNames())
      .attr('data-id', node.id)
    if (this.state.errored) {
      let errorEl = $$(this.tagName).addClass('se-error').append(
        this.context.iconProvider.renderIcon($$, 'graphic-load-error').addClass('se-icon')
      )
      this._renderError($$, errorEl)
      el.append(errorEl)
    } else {
      el.append(
        $$('img').attr({ src: url })
          .on('error', this._onLoadError)
      )
    }
    return el
  }

  _renderError ($$, errorEl) {
    errorEl.append(
      this.getLabel('graphic-load-error')
    )
  }

  _getClassNames () {
    return 'sc-graphic'
  }

  get tagName () {
    return 'div'
  }

  _onLoadError () {
    this.extendState({ errored: true })
  }
}
