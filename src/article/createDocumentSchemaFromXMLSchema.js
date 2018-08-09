import {
  XMLTextElement, XMLElementNode, XMLAnnotationNode,
  XMLAnchorNode, XMLInlineElementNode, XMLExternalNode,
  XMLContainerNode, XMLSchema, DocumentSchema
} from 'substance'

export default function createDocumentSchemaFromXMLSchema (XMLSchemaData, name, version, DocumentClass, docTypeParams) {
  let xmlSchema = XMLSchema.fromJSON(XMLSchemaData)
  const tagNames = xmlSchema.getTagNames()
  let nodeClasses = []
  // add node definitions and converters
  tagNames.forEach((tagName) => {
    const elementSchema = xmlSchema.getElementSchema(tagName)
    const name = elementSchema.name
    let NodeClass
    switch (elementSchema.type) {
      case 'element': {
        NodeClass = XMLElementNode
        break
      }
      case 'hybrid': {
        throw new Error('Mixed element types are not supported yet.')
      }
      case 'text': {
        NodeClass = XMLTextElement
        break
      }
      case 'annotation': {
        NodeClass = XMLAnnotationNode
        break
      }
      case 'anchor': {
        NodeClass = XMLAnchorNode
        break
      }
      case 'inline-element': {
        NodeClass = XMLInlineElementNode
        break
      }
      case 'external': {
        NodeClass = XMLExternalNode
        break
      }
      case 'container': {
        NodeClass = XMLContainerNode
        break
      }
      default:
        throw new Error('Illegal state')
    }
    // anonymous class definition
    class Node extends NodeClass {}
    Node.type = name
    Node._elementSchema = xmlSchema.getElementSchema(name)

    nodeClasses.push(Node)
  })

  let schema = new DocumentSchema({
    name,
    version,
    DocumentClass,
    // TODO: try to get rid of this
    defaultTextType: 'p'
  })
  schema.addNodes(nodeClasses)
  // HACK: add legacy API (Formerly XMLSchema)
  ;['getStartElement', 'validateElement', 'getElementSchema'].forEach(methodName => {
    schema[methodName] = (...args) => {
      return xmlSchema[methodName](...args)
    }
  })
  // other legacy functions that we had add manually
  schema.getName = () => { return name }
  schema.getDocTypeParams = () => { return docTypeParams }

  return schema
}
