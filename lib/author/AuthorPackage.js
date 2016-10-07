import { BasePackage, PersistencePackage } from 'substance'
import AuthorImporter from './AuthorImporter'
import AuthorExporter from './AuthorExporter'
import JATSPackage from '../jats/package'
import HeadingPackage from './heading/package'
import CommonPackage from '../common/package'
import InlineWrapperPackage from '../inline-wrapper/InlineWrapperPackage'
import UnsupportedNodePackage from '../unsupported/UnsupportedNodePackage'
import Author from './Author'

export default {
  name: 'author',
  configure: function(config) {
    config.setInterfaceComponentClass(Author)

    // Now import base packages
    config.import(BasePackage)
    config.import(PersistencePackage)

    config.import(JATSPackage)
    config.import(HeadingPackage)
    config.import(CommonPackage)

    // support inline wrappers, for all hybrid types that can be
    // block-level but also inline.
    config.import(InlineWrapperPackage)
    // catch all converters
    config.import(UnsupportedNodePackage)

    // Override Importer/Exporter
    config.addImporter('jats', AuthorImporter)
    config.addExporter('jats', AuthorExporter)
  }
}
