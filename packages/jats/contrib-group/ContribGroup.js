'use strict';

var Container = require('substance/model/Container');

function ContribGroup() {
  ContribGroup.super.apply(this, arguments);
}

Container.extend(ContribGroup);

ContribGroup.static.name = "contrib-group";

ContribGroup.static.defineSchema({
  attributes: { type: 'object', default: {} },
  nodes: { type: ['id'], default: [] }
});


module.exports = ContribGroup;
