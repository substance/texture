'use strict';
var Configurator = require('substance/util/Configurator');

function AuthorConfigurator() {
  AuthorConfigurator.super.apply(this, arguments);
}

Configurator.extend(AuthorConfigurator);

module.exports = AuthorConfigurator;