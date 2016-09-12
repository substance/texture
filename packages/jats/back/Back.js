'use strict';

import { Container } from 'substance'

/*
  Back matter

  Material published with an article but following the narrative flow.
*/
function Back() {
  Back.super.apply(this, arguments);
}

Container.extend(Back);

Back.type = 'back';

/*
  Attributes
    id Document Internal Identifier
    xml:base Base

  Content
    (label?, title*, (ack | app-group | bio | fn-group | glossary | ref-list | notes | sec)*)
*/

Back.define({
  attributes: { type: 'object', default: {} },
  label: { type: 'label', optional:true },
  titles: { type: ['title'], default: [] },
  nodes: { type: ['id'], default: [] },
});

export default Back;
