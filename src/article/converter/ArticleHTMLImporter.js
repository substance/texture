import { HTMLImporter } from 'substance'
import InternalArticleSchema from '../InternalArticleSchema'

export default class ArticleHTMLImporter extends HTMLImporter {
  constructor (configurator) {
    super({
      schema: InternalArticleSchema,
      converters: configurator.converters.html,
      idAttribute: 'data-id'
    })
  }
}
