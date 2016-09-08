'use strict';

import { TextNode } from 'substance'

function Label() {
  Label.super.apply(this, arguments);
}

TextNode.extend(Label);

Label.type = 'label';

Label.define({
  attributes: { type: 'object', default: {} },
});

export default Label;