'use strict';

var TOCProvider = require('substance/ui/TOCProvider');

function AuthorTOCProvider(documentSession) {
  TOCProvider.call(this, documentSession.getDocument(), {
    containerId: 'bodyFlat'
  });
}

TOCProvider.extend(AuthorTOCProvider);

module.exports = AuthorTOCProvider;