import { HTMLExporter, DefaultDOMElement } from 'substance'

export default class ArticleHTMLExporter extends HTMLExporter {
  constructor (configurator) {
    super({
      converters: _getConverters(configurator),
      idAttribute: 'data-id',
      elementFactory: DefaultDOMElement.createDocument('html')
    })
  }
}

// TODO: we should improve the configurators internal format, e.g. use Map instead of {}
function _getConverters (configurator) {
  return configurator.getConverters('html')
}
