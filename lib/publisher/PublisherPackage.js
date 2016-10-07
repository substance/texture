import { BasePackage, PersistencePackage } from 'substance'
import JATSPackage from '../jats/package'
import CommonPackage from '../common/package'
import InlineWrapperPackage from '../inline-wrapper/InlineWrapperPackage'
import UnsupportedNodePackage from '../unsupported/UnsupportedNodePackage'
import Publisher from './Publisher'

export default {
  name: 'publisher',
  configure: function(config) {
    config.setInterfaceComponentClass(Publisher)

    config.import(BasePackage)
    config.import(PersistencePackage)
    config.import(JATSPackage)
    config.import(CommonPackage)

    // support inline wrappers, for all hybrid types that can be
    // block-level but also inline.
    config.import(InlineWrapperPackage)
    // catch all converters
    config.import(UnsupportedNodePackage)
  }
}