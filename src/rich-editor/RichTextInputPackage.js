import {
  Document
} from 'substance'

import HTMLContent from './HTMLContent'
import Emphasis from './Emphasis'
import Strong from './Strong'
import Subscript from './Subscript'
import Superscript from './Superscript'

import RichtextHTMLImporter from './RichtextHTMLImporter'

export default {
  name: 'rich-text-input',
  configure: function(config) {
    config.defineSchema({
      name: 'rich-text-input',
      DocumentClass: Document,
      version: '1.0.0'
    })

    config.addNode(HTMLContent)

    let defaultOptions = {
      disableCollapsedCursor: true,
      toolGroup: 'annotations'
    }

    config.addNode(Emphasis, defaultOptions)
    config.addNode(Strong, defaultOptions)
    config.addNode(Subscript, defaultOptions)
    config.addNode(Superscript, defaultOptions)

    config.addConverter('html', {
      type: 'emphasis',
      tagName: 'em'
    })
    config.addConverter('html', {
      type: 'strong',
      tagName: 'strong'
    })
    config.addConverter('html', {
      type: 'subscript',
      tagName: 'sub'
    })
    config.addConverter('html', {
      type: 'superscript',
      tagName: 'sup'
    })

    config.addImporter('html', RichtextHTMLImporter)
  }
}
