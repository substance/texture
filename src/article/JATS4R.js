import { XMLSchema } from 'substance'
import JATS4RData from '../../tmp/JATS4R.data'

const JATS4R = XMLSchema.fromJSON(JATS4RData)


// TODO: this should come from compilation
JATS4R.getName = function() {
  return 'jats4r'
}

JATS4R.getVersion = function() {
  return '1.1'
}

JATS4R.getDocTypeParams = function() {
  return ['article', 'JATS4R 1.1', 'http://texture.substance.io/JATS4R-1.1.dtd']
}

export default JATS4R
