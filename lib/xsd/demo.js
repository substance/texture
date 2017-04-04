import { DefaultDOMElement as DOM, Configurator, uuid } from 'substance'
import vfs from 'vfs'
import JATS from '../util/JATS'
import Validator from './Validator'
import XMLDocument from '../xml/XMLDocument'
import XMLElementNode from '../xml/XMLElementNode'

function validatorDemo() {
  let xml = vfs.readFileSync('data/elife-15278.xml')
  let dom = DOM.parseXML(xml)
  let articleEl = dom.find('article')
  let validator = new Validator(JATS)
  let valid = validator.isValid(articleEl)
  if (!valid) {
    console.info('Article is invalid. \uD83D\uDE1E')
    validator.errors.forEach(e => {
      console.error(e)
    })
  } else {
    console.info('Article is valid. \uD83D\uDE0D')
  }
}

function documentDemo() {
  let config = new Configurator()
  config.defineSchema({
    DocumentClass: XMLDocument
  })
  // create a schema with a node for each element type
  JATS.tagNames.forEach((tagName) => {
    class Node extends XMLElementNode {}
    Node.type = tagName
    config.addNode(Node)
  })
  let xml = vfs.readFileSync('data/elife-15278.xml')
  let dom = DOM.parseXML(xml)
  let doc = new XMLDocument(config.getSchema())
  importElement(doc, dom.find('article'))
  console.info(doc)
}

function importElement(doc, el) {
  let attributes = {}
  el.getAttributes().forEach((val, key) => {
    attributes[key] = val
  })
  let nodeData = {
    type: el.tagName,
    id: el.id || uuid(el.tagName),
    attributes
  }
  let children = el.getChildren()
  nodeData.childNodes = children.map(c => {
    const node = importElement(doc, c)
    return node.id
  })
  return doc.create(nodeData)
}

window.onload = function() {
  documentDemo()
}
