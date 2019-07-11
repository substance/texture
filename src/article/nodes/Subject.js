import { DocumentNode, STRING } from 'substance'

export default class Subject extends DocumentNode {
  // not used
  // toString () {
  //   return this.render().join('')
  // }

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
  category: STRING
}
