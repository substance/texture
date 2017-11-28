import {
  Document, BasePackage, ParagraphPackage
} from 'substance'

import RichTextInputHTMLImporter from './RichTextInputHTMLImporter'
import RichTextInputHTMLExporter from './RichTextInputHTMLExporter'

export default {
  name: 'rich-text-input',
  configure: function(config) {
    config.defineSchema({
      name: 'rich-text-input',
      ArticleClass: Document,
      version: '1.0.0',
      defaultTextType: 'paragraph'
    })

    let defaultOptions = {
      disableCollapsedCursor: true,
      toolGroup: 'overlay'
    }

    config.import(BasePackage, defaultOptions)
    config.import(ParagraphPackage, defaultOptions)
    config.addImporter('html', RichTextInputHTMLImporter)
    config.addExporter('html', RichTextInputHTMLExporter)
  }
}
