import { registerSchema, ListPackage } from 'substance'
import TextureDocument from './TextureDocument'
import TextureArticle from './TextureArticle'
import TextureArticleImporter from './TextureArticleImporter'
import TextureHTMLConverters from './TextureHTMLConverters'
import XMLListNode from './XMLListNode'
import XMLListItemNode from './XMLListItemNode'
import XMLListNodeHTMLConverter from './XMLListNodeHTMLConverter'
import TableElementNode from './TableElementNode'
import TableCellElementNode from './TableCellElementNode'

export default {
  name: 'TextureArticle',
  configure(config) {
    registerSchema(config, TextureArticle, TextureDocument)

    // override the registered nodes
    config.addNode(XMLListNode, true)
    config.addNode(XMLListItemNode, true)
    config.addNode(TableElementNode, true)
    config.addNode(TableCellElementNode, true)

    config.addImporter(TextureArticle.getName(), TextureArticleImporter)
    // enable rich-text support for clipboard
    TextureHTMLConverters.forEach((converter) => {
      config.addConverter('html', converter)
    })
    config.addConverter('html', XMLListNodeHTMLConverter)
    config.addConverter('html', ListPackage.ListItemHTMLConverter)

  }
}
