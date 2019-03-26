import Abstract from './Abstract'
import { ENUM, TEXT } from 'substance'
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
  abstractType: ENUM(['executive-summary', 'web-summary'], { default: '' }),
  title: TEXT(RICH_TEXT_ANNOS)
}
