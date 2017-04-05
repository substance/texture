import { DefaultDOMElement as DOM, Configurator, uuid, forEach } from 'substance'
import vfs from 'vfs'
import JATS from '../util/JATS'
import Validator from './Validator'
import XMLDocument from '../xml/XMLDocument'
import XMLElementNode from '../xml/XMLElementNode'
import compileXSD from './compileXSD'

function _compileXSD() {
  // TODO: ATM we can't import/include other xsd files
  // as soon this is working we should use
  // 'data/JATS/JATS-archive-oasis-article1-mathml3.xsd'
  // instead
  let xsd = vfs.readFileSync('data/JATS/JATS-archive-oasis-article1-mathml3-elements.xsd')
  let schema = compileXSD(xsd)
  console.log(JSON.stringify(schema))
  debugger
}

function createGraph() {
  let parents = {}
  let children = {}
  const tagNames = JATS.map(e=>e.name)
  JATS.forEach((e) => {
    children[e.name] = {}
    forEach(e.dfa, (ts) => {
      forEach(ts, t => {
        t.forEach((idx) => {
          const tName = tagNames[idx]
          if (!tName) return
          parents[tName] = parents[tName] || {}
          parents[tName][e.name] = true
          children[e.name][tName] = true
        })
      })
    })
  })

  let str = []
  tagNames.forEach((n)=>{
    str.push(`# &lt;${n}&gt; [spec](https://jats.nlm.nih.gov/archiving/tag-library/1.1/element/${n}.html)`)
    str.push('')
    let c = children[n] || {}
    c = Object.keys(c)
    if (c.length) {
      c.sort()
      str.push('- children:')
      str.push('')
      str.push('  ' + c.join(', '))
      str.push('')
    }
    let p = parents[n] || {}
    p = Object.keys(p)
    if (p.length) {
      p.sort()
      str.push('- parents:')
      str.push('')
      str.push('  ' + p.join(', '))
      str.push('')
    }
  })
  console.log(str.join('\n'))
}

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
  JATS.forEach((e) => {
    class Node extends XMLElementNode {}
    Node.type = e.name
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
  validatorDemo()
  // _compileXSD()
}
