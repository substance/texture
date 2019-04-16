import { DocumentNode, STRING } from 'substance'

export default class Subject extends DocumentNode {
  toString () {
    return this.render()
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
Subject.schema = {
  type: 'subject',
  name: STRING,
  category: STRING,
  language: STRING
}
