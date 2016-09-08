'use strict';

import { Annotation } from 'substance'

function Subscript() {
  Subscript.super.apply(this, arguments);
}

Annotation.extend(Subscript);

Subscript.type = 'subscript';

Subscript.define({
  attributes: { type: 'object', default: {} },
});

export default Subscript;
