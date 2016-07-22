import Overlay from 'substance/ui/Overlay'
import Toolbar from 'substance/ui/Toolbar'

import AuthorImporter from './AuthorImporter'
import AuthorExporter from './AuthorExporter'

export default {
  name: 'author',
  configure: function(config) {
    // Now import base packages
    config.import(require('substance/packages/base/BasePackage'))
    config.import(require('substance/packages/persistence/PersistencePackage'))
    // TODO: see substance#712
    config.addComponent('overlay', Overlay)
    // TODO: this should be used as default, too
    config.setToolbarClass(Toolbar)

    config.import(require('../jats/package'))
    config.import(require('./heading/package'))
    config.import(require('../common/package'))
    config.addStyle(__dirname, '_author.scss')


    // support inline wrappers, for all hybrid types that can be
    // block-level but also inline.
    config.import(require('../inline-wrapper/package'))
    // catch all converters
    config.import(require('../unsupported/package'))

    // Override Importer/Exporter
    config.addImporter('jats', AuthorImporter)
    config.addExporter('jats', AuthorExporter)
  }
}
