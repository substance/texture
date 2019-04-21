import { DocumentNode, STRING } from 'substance'
import { extractInitials } from './modelHelpers'

/* Holds data for persons and instituions/groups in references */
export default class RefContrib extends DocumentNode {
  toString () {
    return this.render().join('')
  }

  render (options = {}) {
    let { givenNames, name } = this

    let result = [
      name
    ]

    if (givenNames) {
      if (options.short) {
        givenNames = extractInitials(givenNames)
      }

      result.push(
        ' ',
        givenNames
      )
    }
    return result
  }
}

RefContrib.schema = {
  type: 'ref-contrib',
  name: STRING, // either family name or institution name
  givenNames: STRING
}
