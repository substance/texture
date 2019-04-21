import { DocumentNode, STRING, TEXT } from 'substance'
import { RICH_TEXT_ANNOS } from './modelConstants'

export default class Keyword extends DocumentNode {
  toString () {
    return this.render().join('')
  }

  render (options = {}) {
    let { category, name } = this
    let result = [ name ]
    if (!options.short) {
      if (category) {
        result.push(', ', category)
      }
    }
    return result
  }
}

Keyword.schema = {
  type: 'keyword',
  name: TEXT(...RICH_TEXT_ANNOS),
  category: STRING,
  language: STRING
}
