'use strict';

var Container = require('substance/model/Container');

function Body() {
  Body.super.apply(this, arguments);
}

Container.extend(Body);

Body.static.name = "body";
Body.static.allowedContext = "article";

/*
  Attributes
    id Document Internal Identifier
    specific-use Specific Use
    xml:base Base

  Content
  (
   (address | alternatives | array | boxed-text | chem-struct-wrap | code | fig | fig-group | graphic | media | preformat | supplementary-material | table-wrap | table-wrap-group | disp-formula | disp-formula-group | def-list | list | tex-math | mml:math | p | related-article | related-object | ack | disp-quote | speech | statement | verse-group | x)*,
   (sec)*,
   sig-block?
  )
*/

module.exports = Body;
