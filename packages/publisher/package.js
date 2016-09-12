import { Overlay, Toolbar, BasePackage, PersistencePackage } from 'substance'
import JATSPackage from '../jats/package'
import CommonPackage from '../common/package'
import InlineWrapperPackage from '../inline-wrapper/InlineWrapperPackage'
import UnsupportedNodePackage from '../unsupported/UnsupportedNodePackage'

export default {
  name: 'publisher',
  configure: function(config) {
    config.import(BasePackage);
    config.import(PersistencePackage);
    // TODO: see substance#712
    config.addComponent('overlay', Overlay);
    // TODO: this should be used as default, too
    config.setToolbarClass(Toolbar);

    config.import(JATSPackage);
    config.import(CommonPackage);

    // support inline wrappers, for all hybrid types that can be
    // block-level but also inline.
    config.import(InlineWrapperPackage);
    // catch all converters
    config.import(UnsupportedNodePackage);
  }
}