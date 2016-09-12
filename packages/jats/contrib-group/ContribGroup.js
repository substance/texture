'use strict';

import { Container } from 'substance'

function ContribGroup() {
  ContribGroup.super.apply(this, arguments);
}

Container.extend(ContribGroup);

ContribGroup.type = "contrib-group";

ContribGroup.define({
  attributes: { type: 'object', default: {} },
  nodes: { type: ['id'], default: [] }
});

export default ContribGroup;
