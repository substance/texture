import { HTMLExporter, DefaultDOMElement } from 'substance'

export default class ArticleHTMLExporter extends HTMLExporter {
  constructor (articleConfig) {
    super({
      converters: articleConfig.getConverters('html'),
      idAttribute: 'data-id',
      elementFactory: DefaultDOMElement.createDocument('html')
    })
  }

  /*
    Customised annotatedText method, that takes a document and $$ to be
    compatible with other rendering contexts
  */
  annotatedText (path, doc, $$) {
    if (doc) {
      this.state.doc = doc
    }
    if ($$) {
      this.$$ = $$
    }
    return super.annotatedText(path)
  }

  getDefaultBlockConverter () {
    return defaultBlockConverter // eslint-disable-line no-use-before-define
  }
}

// TODO: the default converter is used for nodes that do not have a converter registered
const defaultBlockConverter = {
  export: function (node, el, converter) {
    el.attr('data-type', node.type)
    const nodeSchema = node.getSchema()
    for (let prop of nodeSchema) {
      const name = prop.name
      if (name === 'id' || name === 'type') continue
      // using RDFa like attributes
      let propEl = converter.$$('div').attr('property', name)
      let value = node[name]
      if (prop.isText()) {
        propEl.append(converter.annotatedText([node.id, name]))
      } else if (prop.isReference()) {
        if (prop.isOwned()) {
          value = node.resolve(name)
          if (prop.isArray()) {
            propEl.append(value.map(child => converter.convertNode(child)))
          } else {
            propEl.append(converter.convertNode(value))
          }
        } else {
          // TODO: what to do with relations? maybe create a link pointing to the real one?
          // or render a label of the other
          // For now, we skip such props
          continue
        }
      } else {
        propEl.append(value)
      }
      el.append(propEl)
    }
  }
}
