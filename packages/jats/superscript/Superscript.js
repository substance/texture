'use strict';

import { Annotation } from 'substance'

function Superscript() {
  Superscript.super.apply(this, arguments);
}

Annotation.extend(Superscript);

Superscript.type = 'superscript';

Superscript.define({
  attributes: { type: 'object', default: {} },
});

export default Superscript;
