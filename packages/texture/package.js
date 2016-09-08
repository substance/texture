'use strict';

import { ProseEditorPackage } from 'substance'
import AuthorPackage from '../author/package'
import PublisherPackage from '../publisher/package'

export default {
  name: 'scientist',
  configure: function(config) {
    var Configurator = ProseEditorPackage.Configurator
    // Default configuration for available scientist modes
    config.addConfigurator('author', new Configurator().import(AuthorPackage));
    config.addConfigurator('publisher', new Configurator().import(PublisherPackage));
  }
};
