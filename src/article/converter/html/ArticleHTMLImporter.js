import { HTMLImporter } from 'substance'
import InternalArticleSchema from '../../InternalArticleSchema'

export default class ArticleHTMLImporter extends HTMLImporter {
  constructor (configurator) {
    super({
      schema: InternalArticleSchema,
      converters: _getConverters(configurator),
      idAttribute: 'data-id'
    })
  }
}

// TODO: we should improve the configurators internal format, e.g. use Map instead of {}
function _getConverters (configurator) {
  return configurator.getConverters('html')
}
