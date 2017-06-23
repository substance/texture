import { isString, DefaultDOMElement } from 'substance'

export default function jats2texture(article) {
  let dom = article
  if (isString(dom)) {
    dom = DefaultDOMElement.parseXML(article)
  }
  // wrap containers
  wrapAbstractContent(dom)
  wrapBodyContent(dom)

  // turn <sec> into <heading>
  secToHeadings(dom)

  // bring block-level elements to top
  pBlock(dom)

  return dom
}

const ABSTRACT_META = ['object-id','sec-meta', 'label', 'title'].reduce((m, n) => { m[n] = true; return m}, {})
const ABSTRACT_BACK = ['notes','fn-group','glossary','ref-list'].reduce((m, n) => { m[n] = true; return m}, {})

function wrapAbstractContent(article) {
  let abstracts = article.findAll('abstract')
  abstracts.forEach( (abstract) => {
    // restructure child nodes
    const meta = []
    const content = []
    const back = []
    abstract.children.forEach((child) => {
      const tagName = child.tagName
      if (ABSTRACT_META[tagName]) {
        meta.push(child)
      } else if (ABSTRACT_BACK[tagName]) {
        back.push(child)
      } else {
        content.push(child)
      }
    })
    abstract.empty()
    abstract.append(meta)
    abstract.append(article.createElement('abstract-content').append(content))
    abstract.append(back)
  })
}

function wrapBodyContent(article) {
  let bodies = article.findAll('body')
  bodies.forEach((body) => {
    const sigBlock = body.find('sig-block')
    const children = body.children
    body.empty()
    body.append(
      article.createElement('body-content').append(children)
    )
    if (sigBlock) {
      body.append(sigBlock)
    }
  })
}

/*
  In JATS 1.1 it is allowed to have block level elements inside of `<p>`.
  We split these paragraphs, inserting new block-level elements.
*/
function pBlock(article) {
  article.findAll('p').forEach(_pBlock)
}

// TODO: add all of them
const BLOCKS = ['fig', 'fig-group', 'media']
const isBlock = BLOCKS.reduce((m, n) => { m[n] = true; return m}, {})

function _pBlock(p) {
  let parent = p.parentNode
  let children = p.children
  let L = children.length
  // doing it reverse so that we don't miss elements due to the ongoing tranformations
  for (var i = L - 1; i >= 0; i--) {
    let child = children[i]
    if (isBlock[child.tagName]) {
      // create a new <p>
      let newP = parent.createElement('p')
      let childPos = p.getChildIndex(child)
      let siblings = p.childNodes.slice(childPos+1)
      // move all subsequent siblings to the new <p>
      // and insert the block element and the new one after the current <p>
      let pos = parent.getChildIndex(p)+1
      parent.insertAt(pos, child)
      if (siblings.length > 0) {
        newP.append(siblings)
        parent.insertAt(pos+1, newP)
      }
    }
  }
}

function secToHeadings(article) {
  // find all top-level sections
  let topLevelSecs = article.findAll('sec').filter(sec => sec.parentNode.tagName !== 'sec')
  topLevelSecs.forEach((sec) => {
    _replaceEl(sec, _flattenSec(sec, 1))
  })
}

function _replaceEl(el, els) {
  const parent = el.parentNode
  const next = el.nextSibling
  els.forEach(_el => parent.insertBefore(_el, next))
  el.remove()
}

function _flattenSec(sec, level) {
  let result = []

  let h = sec.createElement('heading')
  h.attr(sec.getAttributes())
  h.attr('level', level)

  // move the section front matter
  if(sec.find('sec-meta')) {
    console.error('<sec-meta> is not supported by <heading> right now.')
  }
  let label = sec.find('label')
  if (label) {
    h.attr('label', label.textContent)
    label.remove()
  }
  let title = sec.find('title')
  if (title) {
    h.append(title.childNodes)
    title.remove()
  }

  result.push(h)

  // process the remaining content recursively
  let children = sec.children
  let L = children.length
  for (let i = 0; i < L; i++) {
    const child = children[i]
    if (child.tagName === 'sec') {
      result = result.concat(_flattenSec(child, level+1))
    } else {
      result.push(child)
    }
  }

  return result
}
