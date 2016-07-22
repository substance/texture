'use strict';

var Container = require('substance/model/Container');

function ContribGroup() {
  ContribGroup.super.apply(this, arguments);
}

Container.extend(ContribGroup);

ContribGroup.type = "contrib-group";

ContribGroup.define({
  attributes: { type: 'object', default: {} },
  nodes: { type: ['id'], default: [] }
});

module.exports = ContribGroup;
