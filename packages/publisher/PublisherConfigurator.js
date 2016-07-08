'use strict';

var Configurator = require('substance/util/Configurator');

function PublisherConfigurator() {
  PublisherConfigurator.super.apply(this, arguments);
}

Configurator.extend(PublisherConfigurator);

module.exports = PublisherConfigurator;