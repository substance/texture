import { deserializeXMLSchema } from 'substance'
import restrictedJATSData from '../../tmp/restrictedJATS.data'

const restrictedJATS = deserializeXMLSchema(restrictedJATSData)

// TODO: this should come from compilation
restrictedJATS.getName = function() {
  return 'restrictedJATS'
}

restrictedJATS.getVersion = function() {
  return '1.1'
}

restrictedJATS.getStartElement = function() {
  return 'article'
}


export default restrictedJATS