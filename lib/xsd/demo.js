import vfs from 'vfs'
import DFABuilder from './DFABuilder'

window.onload = function() {
  let JATS_XSD = vfs.readFileSync('data/JATS.xsd')
  // constructs a specification for a DFA which will be persisted
  // or used to generate a JATS scanner / walker
  // TODO: dunno yet where this route will lead us
  let dfaData = DFABuilder.compile(JATS_XSD, {
    output: 'json'
  })
  console.log(dfaData)
  // console.log("Scanner:", JSON.stringify(scanner.serialize()))
  // let XML = vfs['data/elife-15278.xml']
}
