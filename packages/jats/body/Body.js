import { Container } from 'substance'

class Body extends Container {}

Body.type = "body"

/*
  Content
   (address | alternatives | array | boxed-text | chem-struct-wrap | code | fig | fig-group | graphic | media | preformat | supplementary-material | table-wrap | table-wrap-group | disp-formula | disp-formula-group | def-list | list | tex-math | mml:math | p | related-article | related-object | ack | disp-quote | speech | statement | verse-group | x)*,
   (sec)*,
   sig-block?
*/

Body.define({
  attributes: { type: 'object', default: {} },
  nodes: { type: ['id'], default: [] },
  sigBlock: { type: ['sig-block'], optional: true }
})

export default Body
