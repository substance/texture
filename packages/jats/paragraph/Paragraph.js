'use strict';

import { TextBlock } from 'substance'

function ParagraphNode() {
  ParagraphNode.super.apply(this, arguments);
}

TextBlock.extend(ParagraphNode);

ParagraphNode.type = "paragraph";

ParagraphNode.define({
  attributes: { type: 'object', default: {} },
});

export default ParagraphNode;
