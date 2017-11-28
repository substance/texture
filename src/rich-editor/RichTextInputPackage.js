import {
  Document
} from 'substance'

import HTMLContent from './HTMLContent'

export default {
  name: 'rich-text-input',
  configure: function(config) {
    config.defineSchema({
      name: 'rich-text-input',
      DocumentClass: Document,
      version: '1.0.0'
    })

    config.addNode(HTMLContent)
  }
}
