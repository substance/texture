import { DefaultDOMElement } from 'substance'

/*
  Generates a presentation of a given XSD file content
  consisting of 'groups' and 'elements'.
*/
export function parseXSD(xsdString) {
  const xsdDoc = DefaultDOMElement.parseXML(xsdString, 'full-doc')
  const schemaEl = xsdDoc.find('schema')
  if (!schemaEl) throw new Error('Could not find <schema>')
  return compileSchema(schemaEl)
}

export const ELEMENT = Symbol('ELEMENT')
export const ATTRIBUTE = Symbol('ATTRIBUTE')
export const CHOICE = Symbol('CHOICE')
export const SEQUENCE = Symbol('SEQUENCE')
export const GROUP = Symbol('GROUP')
export const REFERENCE = Symbol('REFERENCE')

function compileSchema(schemaEl) {
  // first iteration: group by elements and groups
  let children = schemaEl.getChildren()
  let state = {
    groups: {},
    elements: {},
    addNode(node) {
      if (node.type === GROUP) {
        if (this.groups[node.name]) throw new Error('Group with this name does already exist: ' + node.name)
        this.groups[node.name] = node
      } else if (node.type === ELEMENT) {
        if (this.elements[node.name]) throw new Error('Element with this name does already exist: ' + node.name)
        this.elements[node.name] = node
      }
    }
  }
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    const tagName = _getTagNameWithoutNS(child)
    switch(tagName) {
      case 'element': {
        parseElement(state, child)
        break
      }
      case 'group': {
        parseGroup(state, child)
        break
      }
      default:
        //
    }
  }
  return state
}

/*
Content: (annotation?, ((simpleType | complexType)?, (unique | key |
keyref)*))

In JATS
- in definition, only the 'name' attribute is used
- in references, only 'ref', 'minOccurs', and 'maxOccurs' are used
- unique, key, and keyref elements are not used at all
- only complexType is used
*/

function parseElement(state, el) {
  // ATTENTION: this implementation simplified according to the comment above.
  let name = el.attr('name')
  let children = el.getChildren()
  let attributes, content
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    const tagName = _getTagNameWithoutNS(child)
    if (tagName === 'complexType') {
      let result = parseComplexType(state, child)
      attributes = result.attributes
      content = result.content
    } else {
      // TODO: simpleType is not used in JATS so we did not implement it
    }
  }
  let element = new Element(name, attributes, content)
  state.addNode(element)
  return element
}

/*
  Content: (annotation?, (simpleContent | complexContent | ((group | all |
  choice | sequence)?, ((attribute | attributeGroup)*, anyAttribute?))))

  => first element is an optional annotation
  => then comes either
      - a simpleContent
      - a complexContent
      - or zero-or-one of [group,choice,sequence]
        plus any amount of [attribute, attributeGroup], followed by an optional anyAttribute

  In JATS
    - 'simpleContent' and 'complexContent' are not used
    - 'attributeGroup' and 'anyAttribute' are not used
    - complexType is the only type used in element definitions
*/
function parseComplexType(state, el) {
  // ATTENTION: this is only a subset of XSD, which is used by JATS xsd
  const children = el.children
  let content
  let attributes = {}
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    const tagName = _getTagNameWithoutNS(child)
    switch(tagName) {
      case 'group': {
        content = parseReference(state, child)
        break
      }
      case 'choice': {
        content = parseChoice(state, child)
        break
      }
      case 'sequence': {
        content = parseSequence(state, child)
        break
      }
      case 'attribute': {
        const attribute = parseAttribute(state, child)
        attributes[attribute.name] = attribute
        break
      }
      default:
        //
    }
  }
  return { attributes, content }
}

/*
<attribute
  default = string
  fixed = string
  form = (qualified | unqualified)
  id = ID
  name = NCName
  ref = QName
  type = QName
  use = (optional | prohibited | required): optional
  {any attributes with non-schema Namespace...}>
Content: (annotation?, (simpleType?))
</attribute>

In JATS
  - 'ref' is used to add attributes from other namespaces
  - 'form', 'id' are not used
  - only 'required' and 'optional' are used for 'use'
  - simpleType is only used for enumerations, to specify the allowed values of the attribute
*/
function parseAttribute(state, el) {
  let attributes = el.getAttributes()
  let name = attributes.get('ref') || attributes.get('name')
  let params = {}
  const use = attributes.get('use')
  const valueType = attributes.get('type')
  const defaultValue = attributes.get('default')
  const fixedValue = attributes.get('fixed')
  if (use === 'optional') {
    params.optional = true
  }
  if (use === 'required') {
    params.required = true
  }
  if (valueType) {
    params.valueType = valueType
  }
  // TODO: can we cast this to the correct type?
  if (defaultValue !== undefined) {
    params.defaultValue = defaultValue
  }
  if (fixedValue !== undefined) {
    params.fixedValue = fixedValue
  }
  return new Attribute(name, params)
}

function parseGroup(state, el) {
  let name = el.attr('name')
  let children = el.getChildren()
  let content
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    const tagName = _getTagNameWithoutNS(child)
    if (tagName === 'choice') {
      content = parseChoice(state, child)
      break
    } else if (tagName === 'sequence') {
      content = parseSequence(state, child)
      break
    }
  }
  let group = new Group(name, content)
  state.addNode(group)
  return group
}

function parseReference(state, el) {
  let cardinality = _getCardinality(el)
  let targetType = _tagnameToSymbol(_getTagNameWithoutNS(el))
  let targetName = el.attr('ref')
  return new Reference(targetName, targetType, cardinality)
}

function parseChoice(state, el) {
  return _parseContainer(state, el, CHOICE)
}

function parseSequence(state, el) {
  return _parseContainer(state, el, SEQUENCE)
}

function _parseContainer(state, el, type) {
  let cardinality = _getCardinality(el)
  let children = []
  el.children.forEach((child) => {
    const tagName = _getTagNameWithoutNS(child)
    switch(tagName) {
      case 'choice': {
        children.push(parseChoice(state, child))
        break
      }
      case 'sequence': {
        children.push(parseSequence(state, child))
        break
      }
      // these must be references here
      case 'element':
      case 'group': {
        children.push(parseReference(state, child))
        break
      }
      default:
        throw new Error('Not supported')
    }
  })
  if (type === CHOICE) {
    return new Choice(children, cardinality)
  } else if (type === SEQUENCE) {
    return new Sequence(children, cardinality)
  }
}

function _tagnameToSymbol(tagName) {
  switch(tagName) {
    case 'element': return ELEMENT
    case 'attribute': return ATTRIBUTE
    case 'choice': return CHOICE
    case 'sequence': return SEQUENCE
    case 'group': return GROUP
    default:
      throw new Error('Unsupported tag name: ' + tagName)
  }
}

let __id__ = 0

class Element {
  // TODO: not there yet - typeEl is the XSD element
  constructor(name, attributes = {}, content = null) {
    if (!name) throw new Error("'name' is mandatory")
    this.id = __id__++
    this.name = name
    this.attributes = attributes
    this.content = content
  }
}

Element.prototype.type = ELEMENT

class Attribute {
  constructor(name, params) {
    this.name = name
    Object.assign(this, params)
  }
}

Attribute.prototype.type = ATTRIBUTE

/*
  In JATS
  - in definitions groups only have 'name'
  - in references groups have 'ref', 'minOccurs', 'maxOccurs'
  - content is either 'choice', or 'sequence'
  - group content does not have a cardinality, probably so that
    it makes sense to combine/join groups

<group
  name= NCName
  id = ID
  maxOccurs = (nonNegativeInteger | unbounded) : 1
  minOccurs = nonNegativeInteger : 1
  name = NCName
  ref = QName
  {any attributes with non-schema Namespace}...>
Content: (annotation?, (all | choice | sequence))
</group>

  Note: a group is basically a named choice or sequence
    which can be used in other elements
*/
class Group {
  constructor(name, content) {
    if (!name) throw new Error("'name' is mandatory")
    this.id = __id__++
    this.name = name
    this.content = content
  }
}

Group.prototype.type = GROUP

class Reference {

  constructor(targetName, targetType, cardinality) {
    if (!targetName) throw new Error("'targetName' is mandatory")
    if (!targetType) throw new Error("'targetType' is mandatory")
    this.targetName = targetName
    // NOTE: targetType is either GROUP or ELEMENT
    this.targetType = targetType
    this.cardinality = cardinality
  }
}

Reference.prototype.type = REFERENCE

/*
  Allows only one of the alternatives given as children

  In JATS,
  - 'id' is not used
  - all variants of cardinalities are used
  - all variants of contents are used, except of 'any'
  - inside groups, choices do not have cardinalities.
  - there are some complexTypes with empty choice elements.
    Together with `mixed=true` this means, only plain-text is allowed.
    Occurrences:
    alt-text, article-id, copyright-year, day, elocation-id
    era, fpage, glyph-data, issue-id, journal-id,
    lpage, month, object-id, page-range, pub-id, rp,
    season, tex-math, year
    => seems to be a way to allow for #PCDATA
  - In some groups there are empty choice elements.
    Occurrences:
    city-elements,
    contrib-id-model,
    institution-id-model,
    postal-code-elements,
    rt-elements,
    state-elements: seems to be overcomplicated, an empty sequence would have done it

  <choice
    id = ID
    maxOccurs= (nonNegativeInteger | unbounded) : 1
    minOccurs= nonNegativeInteger : 1
    {any attributes with non-schema Namespace}...>
  Content: (annotation?, (element | group | choice | sequence | any)*)
  </choice>
*/
class Choice {
  /*
    @param children
    @param cardinality 1 | '*' | '+'
  */
  constructor(children = [], cardinality = 1) {
    this.id = __id__++
    this.children = children
    this.cardinality = cardinality
  }
}

Choice.prototype.type = CHOICE

/*
In JATS
- 'id' is not used
- all variants of content are used, except of 'any' and
- content is never empty
- all cardinalities are used

<sequence
  id = ID
  maxOccurs = (nonNegativeInteger | unbounded) : 1
  minOccurs = nonNegativeInteger : 1
  {any attributes with non-schema Namespace}...>
Content: (annotation?, (element | group | choice | sequence | any)*)
</sequence>
*/
class Sequence {

  constructor(children = [], cardinality = 1) {
    this.id = __id__++
    this.children = children
    this.cardinality = cardinality
  }

}

Sequence.prototype.type = SEQUENCE


function _getTagNameWithoutNS(el) {
  let tagName = el.tagName.split(':')
  return tagName[tagName.length-1]
}

function _getCardinality(el) {
  let minOccurs = el.getAttribute('minOccurs')
  let maxOccurs = el.getAttribute('maxOccurs')
  let cardinality
  if (!minOccurs && !maxOccurs) {
    cardinality = 1
  } else if (minOccurs === '0' && !maxOccurs) {
    cardinality = '?'
  } else if (minOccurs === '0' && maxOccurs === 'unbounded') {
    cardinality = '*'
  } else if (!minOccurs && maxOccurs === 'unbounded') {
    cardinality = '+'
  } else {
    // we only support x, x?, x*, x+
    throw new Error('Cardinality not supported.')
  }
  return cardinality
}
