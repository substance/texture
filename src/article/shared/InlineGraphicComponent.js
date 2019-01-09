import GraphicComponent from './GraphicComponent'

export default class InlineGraphicComponent extends GraphicComponent {
  get tagName () { return 'span' }

  _getClassNames () {
    return 'sc-inline-graphic'
  }

  _renderError ($$, errorEl) {
    errorEl.attr('title', this.getLabel('graphic-load-error'))
  }
}
