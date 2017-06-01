import { Container } from 'substance'

/*
  ref-list

  List of bibliographic references for a document or document component.
*/
class RefList extends Container {}

RefList.type = 'ref-list'

  /*
    (
      label?,
      title?,
      (
        address | alternatives | array | boxed-text | chem-struct-wrap | code | fig |
        fig-group | graphic | media | preformat | supplementary-material | table-wrap |
        table-wrap-group | disp-formula | disp-formula-group | def-list | list | tex-math |
        mml:math | p | related-article | related-object | ack | disp-quote | speech | statement |
        verse-group | x | ref
      )*,
      (ref-list)*
    )
  */
RefList.define({
  attributes: { type: 'object', default: {} },
  label: { type: 'label', optional: true },
  title: { type: 'title', optional: true },
  nodes: { type: ['id'], default: [] }
})

export default RefList
