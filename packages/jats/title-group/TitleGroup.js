'use strict';

var Container = require('substance/model/Container');

function TitleGroup() {
  TitleGroup.super.apply(this, arguments);
}

Container.extend(TitleGroup);

TitleGroup.type = 'title-group';
/*
  Content
  (
    article-title, subtitle*, trans-title-group*, alt-title*, fn-group?
  )
*/
TitleGroup.static.defineSchema({
  attributes: { type: 'object', default: {} },
  nodes: { type: ['id'], default: [] }
});

module.exports = TitleGroup;
