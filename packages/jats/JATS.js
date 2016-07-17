// Helpers to define strict converters
// everything here is taken from JATS 1.1 green http://jats.nlm.nih.gov/archiving/tag-library/1.1/

let JATS = {
  ABSTRACT: ['abstract'],
  ACCESS: ['alt-text','long-desc'],
  ADDRESS_LINK: ['email','ext-link','uri'],
  AFF_ALTERNATIVES: ['aff', 'aff-alternatives'],
  APPEARANCE: ['hr'],
  BLOCK_MATH: ['disp-formula', 'disp-formula-group'],
  BLOCK_DISPLAY: ['address','alternatives','array','boxed-text',
    'chem-struct-wrap', 'code','fig','fig-group','graphic','media',
    'preformat','supplementary-material', 'table-wrap','table-wrap-group'],
  BREAK: ['break'],
  CHEM_STRUCT: ['chem-struct-wrap'],
  CITATION: ['citation-alternatives','element-citation','mixed-citation','nlm-citation'],
  CONTRIB_GROUP: ['contrib-group'],
  DISLAY_BACK_MATTER: ['attrib','permissions'],
  EMPHASIS: ['bold','fixed-case','italic','monospace','overline',
    'overline-start','overline-end','roman','sans-serif','sc','strike',
    'underline','underline-start','underline-end','ruby'],
  FUNDING: ['award-id','funding-source','open-access'],
  INLINE_DISPLAY: ['alternatives', 'inline-graphic', 'private-char'],
  INLINE_MATH: ['chem-struct','inline-formula'],
  INTABLE_PARA: ['disp-quote','speech', 'statement','verse-group'],
  JUST_PARA: ['p'],
  JUST_TABLE: ['table-wrap'],
  KWD_GROUP: ['kwd-group'],
  LIST: ['def-list','list'],
  MATH: ['tex-math','mml:math'],
  NOTHING_BUT_PARA: ['p'],
  PHRASE: ['abbrev','milestone-end','milestone-start','named-content','styled-content'],
  RELATED_ARTICLE: ['related-article','related-object'],
  REST_OF_PARA: ['ack','disp-quote','speech','statement','verse-group'],
  SIMPLE_DISPLAY: ['alternatives','array','code','graphic','media','preformat'],
  SIMPLE_LINK: ['fn','target','xref'],
  SUBSUP: ['sub','sup'],
  TITLE_GROUP: ['article-title', 'subtitle', 'trans-title-group', 'alt-title', 'fn-group'],
  X: ['x'],
}

JATS.ARTICLE_LINK = ['inline-supplementary-material'].concat(JATS.RELATED_ARTICLE)
JATS.ALL_PHRASE = JATS.ADDRESS_LINK
  .concat(JATS.ARTICLE_LINK)
  .concat(JATS.APPEARANCE)
  .concat(JATS.EMPHASIS)
  .concat(JATS.INLINE_DISPLAY)
  .concat(JATS.INLINE_MATH)
  .concat(JATS.MATH)
  .concat(JATS.PHRASE)
  .concat(JATS.SIMPLE_LINK)
  .concat(JATS.SUBSUP)
  .concat(JATS.X)
JATS.PARA_LEVEL = JATS.BLOCK_DISPLAY
  .concat(JATS.BLOCK_MATH)
  .concat(JATS.LIST)
  .concat(JATS.MATH)
  .concat(JATS.NOTHING_BUT_PARA)
  .concat(JATS.RELATED_ARTICLE)
  .concat(JATS.REST_OF_PARA)
  .concat(JATS.X)

export default JATS



