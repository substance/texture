'use strict';

import { Annotation } from 'substance'

function Italic() {
  Italic.super.apply(this, arguments);
}

Annotation.extend(Italic);

Italic.type = 'italic';

Italic.define({
  attributes: { type: 'object', default: {} },
});

export default Italic;
