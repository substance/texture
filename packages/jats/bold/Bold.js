'use strict';

import { Annotation } from 'substance'

function Bold() {
  Bold.super.apply(this, arguments);
}

Annotation.extend(Bold);

Bold.type = 'bold';

Bold.define({
  attributes: { type: 'object', default: {} },
});

export default Bold;
