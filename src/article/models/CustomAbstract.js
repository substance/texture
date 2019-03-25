import Abstract from './Abstract'
import { STRING, TEXT } from 'substance'
import { RICH_TEXT_ANNOS } from './modelConstants'

export default class CustomAbstract extends Abstract {
  static getTemplate () {
    return {
      type: 'custom-abstract',
      content: [
        { type: 'paragraph' }
      ]
    }
  }

  render (options = {}) {
    return this.title || ''
  }
}

CustomAbstract.schema = {
  type: 'custom-abstract',
  abstractType: STRING,
  title: TEXT(RICH_TEXT_ANNOS)
}
