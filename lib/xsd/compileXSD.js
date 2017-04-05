import DFABuilder from './DFABuilder'
import serialize from './serializeDFA'


/*
 Creates a JSON which can be used to create a scanner for the XSD.

 @example

 output:
 ```
 [{ name: "abbrev", attributes: {...}, transitions: {0: {...}}},...]
 ```
*/
export default function compileXSD(xsdStr) {
  const {xsd, dfas} = DFABuilder.compile(xsdStr)
  const compiled = [{name: 'EPSILON'}, {name: 'TEXT'}]
  const serialized = serialize(xsd, dfas)
  serialized.tagNames.forEach((name) => {
    const spec = xsd.elements[name]
    if (!spec) return
    const attributes = spec.attributes
    const dfa = serialized.elements[name]
    compiled.push({
      name,
      attributes,
      dfa
    })
  })
  return compiled
}