import { parseXSD } from './parseXSD'
import createScanner from './createScanner'
import vfs from '../../tmp/vfs'

window.onload = function() {
  let xsd = parseXSD(window.XSD.JATS)
  let scanner = createScanner(xsd)
  // debugger
  // console.log("Scanner:", JSON.stringify(scanner.serialize()))
  // TODO: now it gets interesting: we should load a JATS file and validate it using the scanner
  let XML = vfs['data/elife-15278.xml']
  console.log(XML)
}
