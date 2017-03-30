import DFABuilder from './DFABuilder'

export default function compileXSD(xsdStr) {
  return DFABuilder.compile(xsdStr, {
    output: 'json'
  })
}