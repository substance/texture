import { parseXSD } from './parseXSD'
import createScanner from './createScanner'

window.onload = function() {
  let xsd = parseXSD(window.XSD.JATS)
  let scanner = createScanner(xsd)
  console.log("Scanner:", scanner)
}
