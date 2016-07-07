'use strict';

/* Used only by test suite to test JATS converter functionality. */

var Configurator = require('substance/util/Configurator');

function JATSConfigurator() {
  JATSConfigurator.super.apply(this, arguments);
}

Configurator.extend(JATSConfigurator);

module.exports = JATSConfigurator;