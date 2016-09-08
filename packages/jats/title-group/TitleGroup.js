'use strict';

import { Container } from 'substance'

function TitleGroup() {
  TitleGroup.super.apply(this, arguments);
}

Container.extend(TitleGroup);

TitleGroup.type = "title-group";

/*
  Content
  (
    article-title, subtitle*, trans-title-group*, alt-title*, fn-group?
  )
*/
TitleGroup.define({
  attributes: { type: 'object', default: {} },
  nodes: { type: ['id'], default: [] }
});


export default TitleGroup;
