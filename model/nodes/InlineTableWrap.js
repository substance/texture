'use strict';

// TODO: we should be able to inherit from JATSNode to share properties.

var InlineFigure = require('./InlineFigure');

function InlineTableWrap() {
  InlineTableWrap.super.apply(this, arguments);
}

InlineFigure.extend(InlineTableWrap);

InlineTableWrap.static.name = 'inline-table-wrap';

module.exports = InlineTableWrap;