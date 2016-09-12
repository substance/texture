'use strict';

import { Annotation } from 'substance'

function Monospace() {
  Monospace.super.apply(this, arguments);
}

Annotation.extend(Monospace);

Monospace.type = 'monospace';

Monospace.define({
  attributes: { type: 'object', default: {} },
});

export default Monospace;
