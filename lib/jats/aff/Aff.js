import { DocumentNode } from 'substance'

class Aff extends DocumentNode {}

Aff.type = 'aff'

/*
  Content
  (
    #PCDATA | addr-line | city | country | fax | institution | institution-wrap | phone |
    postal-code | state | email | ext-link | uri | inline-supplementary-material |
    related-article | related-object | hr | bold | fixed-case | italic | monospace |
    overline | overline-start | overline-end | roman | sans-serif | sc | strike |
    underline | underline-start | underline-end | ruby | alternatives | inline-graphic |
    private-char | chem-struct | inline-formula | tex-math | mml:math | abbrev | milestone-end |
    milestone-start | named-content | styled-content | fn | target | xref | sub | sup | x |
    break | label
  )*
*/
Aff.define({
  attributes: { type: 'object', default: {} },
  xmlContent: { type: 'string', default: ''}
})

export default Aff
