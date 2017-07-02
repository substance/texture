import { deserializeXMLSchema } from 'substance'
import restrictedJATSData from '../../tmp/JATS4R.data'

const restrictedJATS = deserializeXMLSchema(restrictedJATSData)

// TODO: this should come from compilation
restrictedJATS.getName = function() {
  return 'jats4r'
}

restrictedJATS.getVersion = function() {
  return '1.1'
}

restrictedJATS.getStartElement = function() {
  return 'article'
}


export default restrictedJATS