import { module } from './test'
import { Configurator } from 'substance'
import JATSPackage from '../../lib/jats/package'
import InlineWrapperPackage from '../../lib/inline-wrapper/InlineWrapperPackage'
import UnsupportedNodePackage from '../../lib/unsupported/UnsupportedNodePackage'

export default function createJATSConfigurator() {
  var configurator = new Configurator();
  configurator.import(JATSPackage);
    // support inline wrappers, for all hybrid types that can be
  // block-level but also inline.
  configurator.import(InlineWrapperPackage);
  // catch all converters
  configurator.import(UnsupportedNodePackage);
  return configurator;
};
