'use strict';

import { TextNode } from 'substance'

function Title() {
  Title.super.apply(this, arguments);
}

TextNode.extend(Title);

Title.type = 'title';

Title.define({
  attributes: { type: 'object', default: {} },
});

export default Title;