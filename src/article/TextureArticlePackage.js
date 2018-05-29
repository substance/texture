import { registerSchema, ListPackage } from 'substance'
import TextureDocument from './TextureDocument'
import InternalArticle from './InternalArticle'
import TextureArticleImporter from './TextureArticleImporter'
import TextureHTMLConverters from './TextureHTMLConverters'
import XMLListNode from './XMLListNode'
import XMLListItemNode from './XMLListItemNode'
import XMLListNodeHTMLConverter from './XMLListNodeHTMLConverter'
import TableElementNode from './TableElementNode'
import TableCellElementNode from './TableCellElementNode'
import FigureModel from './models/FigureModel'

export default {
  name: 'TextureArticle',
  configure(config) {
    registerSchema(config, InternalArticle, TextureDocument)

    // override the registered nodes
    config.addNode(XMLListNode, true)
    config.addNode(XMLListItemNode, true)
    config.addNode(TableElementNode, true)
    config.addNode(TableCellElementNode, true)

    config.addImporter(InternalArticle.getName(), TextureArticleImporter)
    // enable rich-text support for clipboard
    TextureHTMLConverters.forEach((converter) => {
      config.addConverter('html', converter)
    })
    config.addConverter('html', XMLListNodeHTMLConverter)
    config.addConverter('html', ListPackage.ListItemHTMLConverter)

    // Models: Provide API's on top of raw nodes
    config.addModel('fig', FigureModel)
    config.addModel('table-wrap', FigureModel)

  }
}
