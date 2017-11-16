import {
  Configurator
} from 'substance'
import EntitiesPackage from './EntitiesPackage'

export default function createEntityDb() {
  let entitiesConf = new Configurator()
  entitiesConf.import(EntitiesPackage)
  return entitiesConf.createDocument()
}
