# Texture Article

This schema defines a strict sub-set of JATS archiving.
## Supported Elements

### `<abstract>`

**Attributes**:
<pre>
id, xml:base, abstract-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
p*
</pre>
**This element may be contained in:**
<pre>
article-meta
</pre>

### `<addr-line>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
aff
</pre>

### `<aff>`

**Attributes**:
<pre>
id, xml:base, content-type, rid, specific-use, xml:lang
</pre>
**Contains**:
<pre>
(addr-line*, label?, city?, country?, fax?, institution*, institution-wrap*, phone?, postal-code?, state?, email?, ext-link*, uri?)[unordered]
</pre>
**This element may be contained in:**
<pre>
article-meta, person-group
</pre>

### `<ali:free_to_read>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, end_date, start_date
</pre>
**Contains**:
<pre>
EMPTY
</pre>
**This element may be contained in:**
<pre>
permissions
</pre>

### `<ali:license_ref>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, start_date
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
license
</pre>

### `<article>`

**Attributes**:
<pre>
id, xml:base, article-type, specific-use, xml:lang, dtd-version
</pre>
**Contains**:
<pre>
front,body?,back?
</pre>

### `<article-categories>`

**Attributes**:
<pre>
id, xml:base
</pre>
**Contains**:
<pre>
subj-group*
</pre>
**This element may be contained in:**
<pre>
article-meta
</pre>

### `<article-id>`

**Attributes**:
<pre>
id, xml:base, pub-id-type, specific-use
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
article-meta
</pre>

### `<article-meta>`

**Attributes**:
<pre>
id, xml:base
</pre>
**Contains**:
<pre>
article-id*,article-categories?,title-group?,contrib-group*,aff*,pub-date*,volume?,issue?,isbn?,(((fpage,lpage?)?,page-range?)|elocation-id)?,history?,permissions?,abstract?,trans-abstract*,kwd-group*,funding-group*
</pre>
**This element may be contained in:**
<pre>
front
</pre>

### `<article-title>`

**Attributes**:
<pre>
id, xml:base, xml:lang
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|alternatives|inline-graphic|private-char|chem-struct|inline-formula|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup|break)*
</pre>
**This element may be contained in:**
<pre>
element-citation, title-group
</pre>

### `<attrib>`

**Attributes**:
<pre>
id, xml:base, specific-use, xml:lang
</pre>
**Contains**:
<pre>
(TEXT|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
disp-quote
</pre>

### `<award-group>`

**Attributes**:
<pre>
id, xml:base, rid, award-type, specific-use, xml:lang, xlink:type, xlink:href, xlink:role, xlink:title, xlink:show, xlink:actuate
</pre>
**Contains**:
<pre>
funding-source*,award-id*,principal-award-recipient*,principal-investigator*
</pre>
**This element may be contained in:**
<pre>
funding-group
</pre>

### `<award-id>`

**Attributes**:
<pre>
id, xml:base, rid, award-type, specific-use, xml:lang, xlink:type, xlink:href, xlink:role, xlink:title, xlink:show, xlink:actuate
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
award-group
</pre>

### `<back>`

**Attributes**:
<pre>
id, xml:base
</pre>
**Contains**:
<pre>
(fn-group?, ref-list?)[unordered]
</pre>
**This element may be contained in:**
<pre>
article
</pre>

### `<bio>`

**Attributes**:
<pre>
id, xml:base, rid, content-type, specific-use, xml:lang, xlink:type, xlink:href, xlink:role, xlink:title, xlink:show, xlink:actuate
</pre>
**Contains**:
<pre>
p*
</pre>
**This element may be contained in:**
<pre>
contrib
</pre>

### `<body>`

**Attributes**:
<pre>
id, xml:base, specific-use
</pre>
**Contains**:
<pre>
(sec|boxed-text|chem-struct-wrap|code|fig|fig-group|table-wrap|disp-formula|disp-formula-group|def-list|list|p|preformat|disp-quote|disp-formula|disp-formula-group|def-list|list|p|ack|disp-quote|speech|statement|verse-group)*
</pre>
**This element may be contained in:**
<pre>
article
</pre>

### `<bold>`

**Attributes**:
<pre>
id, xml:base, toggle, specific-use
</pre>
**Contains**:
<pre>
(TEXT|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
article-title, attrib, bold, chapter-title, data-title, edition, email, ext-link, fixed-case, given-names, institution, italic, kwd, label, license-p, monospace, overline, p, part-title, patent, phone, prefix, preformat, price, role, sc, series, source, strike, string-name, sub, subject, suffix, sup, surname, td, th, title, trans-title, underline, uri, version, xref
</pre>

### `<break>`

**Attributes**:
<pre>
id, xml:base
</pre>
**Contains**:
<pre>
EMPTY
</pre>
**This element may be contained in:**
<pre>
article-title, chapter-title, institution, kwd, label, part-title, subject, title, trans-title, xref
</pre>

### `<caption>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang, style
</pre>
**Contains**:
<pre>
title?,p*
</pre>
**This element may be contained in:**
<pre>
fig, table-wrap
</pre>

### `<chapter-title>`

**Attributes**:
<pre>
id, xml:base, specific-use, xml:lang
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|alternatives|inline-graphic|private-char|chem-struct|inline-formula|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup|break)*
</pre>
**This element may be contained in:**
<pre>
element-citation
</pre>

### `<city>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
aff
</pre>

### `<code>`

**Attributes**:
<pre>
id, xml:base, code-type, code-version, executable, language, language-version, platforms, position, orientation, specific-use, xml:lang, xml:space
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
body, sec
</pre>

### `<col>`

**Attributes**:
<pre>
id, xml:base, content-type, style, span, width, align, char, charoff, valign
</pre>
**Contains**:
<pre>
EMPTY
</pre>
**This element may be contained in:**
<pre>
colgroup, table
</pre>

### `<colgroup>`

**Attributes**:
<pre>
id, xml:base, content-type, style, span, width, align, char, charoff, valign
</pre>
**Contains**:
<pre>
col*
</pre>
**This element may be contained in:**
<pre>
table
</pre>

### `<collab>`

**Attributes**:
<pre>
id, xml:base, collab-type, symbol, specific-use, xml:lang, xlink:type, xlink:href, xlink:role, xlink:title, xlink:show, xlink:actuate
</pre>
**Contains**:
<pre>
(email?, named-content, contrib-group?, xref*)[unordered]
</pre>
**This element may be contained in:**
<pre>
contrib, element-citation, person-group
</pre>

### `<conf-loc>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
element-citation
</pre>

### `<conf-name>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
element-citation
</pre>

### `<contrib>`

**Attributes**:
<pre>
id, xml:base, contrib-type, corresp, equal-contrib, deceased, rid, specific-use, xlink:type, xlink:href, xlink:role, xlink:title, xlink:show, xlink:actuate
</pre>
**Contains**:
<pre>
(contrib-id*, name?, email?, string-name?, bio?, collab?, role?, xref*)[unordered]
</pre>
**This element may be contained in:**
<pre>
contrib-group
</pre>

### `<contrib-group>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use
</pre>
**Contains**:
<pre>
contrib*
</pre>
**This element may be contained in:**
<pre>
article-meta, collab
</pre>

### `<contrib-id>`

**Attributes**:
<pre>
id, xml:base, contrib-id-type, authenticated, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
contrib
</pre>

### `<copyright-holder>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
permissions
</pre>

### `<copyright-statement>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
permissions
</pre>

### `<copyright-year>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
permissions
</pre>

### `<country>`

**Attributes**:
<pre>
id, xml:base, content-type, country, specific-use, xml:lang
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
aff
</pre>

### `<data-title>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
(TEXT|email|ext-link|uri|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|named-content|styled-content|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
element-citation
</pre>

### `<date>`

**Attributes**:
<pre>
id, xml:base, date-type, publication-format, iso-8601-date, calendar, specific-use
</pre>
**Contains**:
<pre>
((day?,month?)|season)?,year?,era?,string-date?
</pre>
**This element may be contained in:**
<pre>
history
</pre>

### `<date-in-citation>`

**Attributes**:
<pre>
id, xml:base, iso-8601-date, calendar, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
element-citation
</pre>

### `<day>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
date, element-citation, pub-date
</pre>

### `<disp-quote>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
p+,attrib?
</pre>
**This element may be contained in:**
<pre>
body, sec
</pre>

### `<edition>`

**Attributes**:
<pre>
id, xml:base, designator, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|alternatives|inline-graphic|private-char|chem-struct|inline-formula|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
element-citation
</pre>

### `<element-citation>`

**Attributes**:
<pre>
id, xml:base, publication-type, publisher-type, publication-format, specific-use, xml:lang, xlink:type, xlink:href, xlink:role, xlink:title, xlink:show, xlink:actuate
</pre>
**Contains**:
<pre>
(article-title?, chapter-title?, comment?, collab?, edition?, elocation-id?, fpage?, issue?, lpage?, page-range?, person-group*, pub-id*, publisher-loc*, publisher-name*, source?, volume?, year?, month?, day?, conf-name?, conf-loc?, data-title?, part-title?, patent?, series?, version?, uri?, date-in-citation?)[unordered]
</pre>
**This element may be contained in:**
<pre>
ref
</pre>

### `<elocation-id>`

**Attributes**:
<pre>
id, xml:base, content-type, seq, specific-use
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
article-meta, element-citation
</pre>

### `<email>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang, xlink:type, xlink:href, xlink:role, xlink:title, xlink:show, xlink:actuate
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|alternatives|inline-graphic|private-char|chem-struct|inline-formula|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
aff, collab, contrib, data-title
</pre>

### `<era>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
date, pub-date
</pre>

### `<ext-link>`

**Attributes**:
<pre>
id, xml:base, ext-link-type, assigning-authority, specific-use, xml:lang, xlink:type, xlink:href, xlink:role, xlink:title, xlink:show, xlink:actuate
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|alternatives|inline-graphic|private-char|chem-struct|inline-formula|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
aff, article-title, chapter-title, data-title, edition, email, ext-link, given-names, institution, kwd, label, license-p, p, part-title, patent, phone, prefix, role, series, subject, suffix, surname, td, th, title, trans-title, uri, version, xref
</pre>

### `<fax>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
aff
</pre>

### `<fig>`

**Attributes**:
<pre>
id, xml:base, position, orientation, specific-use, xml:lang, fig-type
</pre>
**Contains**:
<pre>
object-id?,label?,caption?,graphic,permissions?
</pre>
**This element may be contained in:**
<pre>
body, sec
</pre>

### `<fixed-case>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use
</pre>
**Contains**:
<pre>
(TEXT|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
article-title, attrib, bold, chapter-title, data-title, edition, email, ext-link, fixed-case, given-names, institution, italic, kwd, label, license-p, monospace, overline, p, part-title, patent, phone, prefix, preformat, price, role, sc, series, source, strike, string-name, sub, subject, suffix, sup, surname, td, th, title, trans-title, underline, uri, version, xref
</pre>

### `<fn>`

**Attributes**:
<pre>
id, xml:base, symbol, fn-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
p+
</pre>
**This element may be contained in:**
<pre>
fn-group
</pre>

### `<fn-group>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
label?,title?,fn+
</pre>
**This element may be contained in:**
<pre>
back
</pre>

### `<fpage>`

**Attributes**:
<pre>
id, xml:base, content-type, seq, specific-use, xml:lang
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
article-meta, element-citation
</pre>

### `<front>`

**Attributes**:
<pre>
id, xml:base
</pre>
**Contains**:
<pre>
journal-meta?,article-meta
</pre>
**This element may be contained in:**
<pre>
article
</pre>

### `<funding-group>`

**Attributes**:
<pre>
id, xml:base, specific-use, xml:lang
</pre>
**Contains**:
<pre>
award-group*
</pre>
**This element may be contained in:**
<pre>
article-meta
</pre>

### `<funding-source>`

**Attributes**:
<pre>
id, xml:base, rid, source-type, country, specific-use, xml:lang, xlink:type, xlink:href, xlink:role, xlink:title, xlink:show, xlink:actuate
</pre>
**Contains**:
<pre>
institution-wrap
</pre>
**This element may be contained in:**
<pre>
award-group
</pre>

### `<given-names>`

**Attributes**:
<pre>
id, xml:base, initials
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|alternatives|inline-graphic|private-char|chem-struct|inline-formula|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
name
</pre>

### `<graphic>`

**Attributes**:
<pre>
id, xml:base, position, orientation, specific-use, xml:lang, content-type, mime-subtype, mimetype, xlink:type, xlink:href, xlink:role, xlink:title, xlink:show, xlink:actuate
</pre>
**Contains**:
<pre>
EMPTY
</pre>
**This element may be contained in:**
<pre>
fig
</pre>

### `<history>`

**Attributes**:
<pre>
id, xml:base
</pre>
**Contains**:
<pre>
date*
</pre>
**This element may be contained in:**
<pre>
article-meta
</pre>

### `<inline-formula>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
tex-math
</pre>
**This element may be contained in:**
<pre>
article-title, chapter-title, edition, email, ext-link, given-names, institution, kwd, label, license-p, p, part-title, patent, phone, prefix, role, series, subject, suffix, surname, td, th, title, trans-title, uri, version, xref
</pre>

### `<institution>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang, xlink:type, xlink:href, xlink:role, xlink:title, xlink:show, xlink:actuate
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|alternatives|inline-graphic|private-char|chem-struct|inline-formula|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup|break)*
</pre>
**This element may be contained in:**
<pre>
aff, institution-wrap
</pre>

### `<institution-id>`

**Attributes**:
<pre>
id, xml:base, institution-id-type, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
institution-wrap
</pre>

### `<institution-wrap>`

**Attributes**:
<pre>
id, xml:base
</pre>
**Contains**:
<pre>
(institution|institution-id)*
</pre>
**This element may be contained in:**
<pre>
aff, funding-source
</pre>

### `<isbn>`

**Attributes**:
<pre>
id, xml:base, publication-format, content-type, specific-use
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
article-meta
</pre>

### `<issue>`

**Attributes**:
<pre>
id, xml:base, content-type, seq, specific-use, xml:lang
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
article-meta, element-citation
</pre>

### `<italic>`

**Attributes**:
<pre>
id, xml:base, toggle, specific-use
</pre>
**Contains**:
<pre>
(TEXT|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
article-title, attrib, bold, chapter-title, data-title, edition, email, ext-link, fixed-case, given-names, institution, italic, kwd, label, license-p, monospace, overline, p, part-title, patent, phone, prefix, preformat, price, role, sc, series, source, strike, string-name, sub, subject, suffix, sup, surname, td, th, title, trans-title, underline, uri, version, xref
</pre>

### `<kwd>`

**Attributes**:
<pre>
id, xml:base, content-type
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|alternatives|inline-graphic|private-char|chem-struct|inline-formula|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup|break)*
</pre>
**This element may be contained in:**
<pre>
kwd-group
</pre>

### `<kwd-group>`

**Attributes**:
<pre>
id, xml:base, kwd-group-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
label?,title?,((kwd|compound-kwd|nested-kwd)+|unstructured-kwd-group*)
</pre>
**This element may be contained in:**
<pre>
article-meta
</pre>

### `<label>`

**Attributes**:
<pre>
id, xml:base, alt, xml:lang
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|alternatives|inline-graphic|private-char|chem-struct|inline-formula|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup|break)*
</pre>
**This element may be contained in:**
<pre>
aff, fig, fn-group, kwd-group, table-wrap
</pre>

### `<license>`

**Attributes**:
<pre>
id, xml:base, license-type, specific-use, xml:lang, xlink:type, xlink:href, xlink:role, xlink:title, xlink:show, xlink:actuate
</pre>
**Contains**:
<pre>
(ali:license_ref?, license-p?)[unordered]
</pre>
**This element may be contained in:**
<pre>
permissions
</pre>

### `<license-p>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|chem-struct|inline-formula|inline-graphic|private-char|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup|price)*
</pre>
**This element may be contained in:**
<pre>
license
</pre>

### `<list>`

**Attributes**:
<pre>
id, xml:base, list-type, prefix-word, list-content, continued-from, specific-use, xml:lang
</pre>
**Contains**:
<pre>
list-item+
</pre>
**This element may be contained in:**
<pre>
body, list-item, sec
</pre>

### `<list-item>`

**Attributes**:
<pre>
id, xml:base, specific-use, xml:lang
</pre>
**Contains**:
<pre>
(p|list)+
</pre>
**This element may be contained in:**
<pre>
list
</pre>

### `<lpage>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
article-meta, element-citation
</pre>

### `<monospace>`

**Attributes**:
<pre>
id, xml:base, toggle, specific-use
</pre>
**Contains**:
<pre>
(TEXT|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
article-title, attrib, bold, chapter-title, data-title, edition, email, ext-link, fixed-case, given-names, institution, italic, kwd, label, license-p, monospace, overline, p, part-title, patent, phone, prefix, preformat, price, role, sc, series, source, strike, string-name, sub, subject, suffix, sup, surname, td, th, title, trans-title, underline, uri, version, xref
</pre>

### `<month>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
date, element-citation, pub-date
</pre>

### `<name>`

**Attributes**:
<pre>
id, xml:base, content-type, name-style, specific-use, xml:lang
</pre>
**Contains**:
<pre>
((surname,given-names?)|given-names),prefix?,suffix?
</pre>
**This element may be contained in:**
<pre>
contrib, name-alternatives, person-group
</pre>

### `<name-alternatives>`

**Attributes**:
<pre>
id, xml:base
</pre>
**Contains**:
<pre>
(name|string-name)+
</pre>
**This element may be contained in:**
<pre>
person-group
</pre>

### `<named-content>`

**Attributes**:
<pre>
id, xml:base, rid, alt, content-type, specific-use, xml:lang, xlink:type, xlink:href, xlink:role, xlink:title, xlink:show, xlink:actuate
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
article-title, chapter-title, collab, data-title, edition, email, ext-link, given-names, institution, kwd, label, license-p, p, part-title, patent, phone, prefix, preformat, role, series, subject, suffix, surname, td, th, title, trans-title, uri, version, xref
</pre>

### `<object-id>`

**Attributes**:
<pre>
id, xml:base, pub-id-type, content-type, specific-use
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
fig, table-wrap
</pre>

### `<overline>`

**Attributes**:
<pre>
id, xml:base, toggle, specific-use
</pre>
**Contains**:
<pre>
(TEXT|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
article-title, attrib, bold, chapter-title, data-title, edition, email, ext-link, fixed-case, given-names, institution, italic, kwd, label, license-p, monospace, overline, p, part-title, patent, phone, prefix, preformat, price, role, sc, series, source, strike, string-name, sub, subject, suffix, sup, surname, td, th, title, trans-title, underline, uri, version, xref
</pre>

### `<p>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|chem-struct|inline-formula|inline-graphic|private-char|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
abstract, bio, body, caption, disp-quote, fn, list-item, sec, trans-abstract
</pre>

### `<page-range>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
article-meta, element-citation
</pre>

### `<part-title>`

**Attributes**:
<pre>
id, xml:base, specific-use, xml:lang
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|alternatives|inline-graphic|private-char|chem-struct|inline-formula|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup|break)*
</pre>
**This element may be contained in:**
<pre>
element-citation
</pre>

### `<patent>`

**Attributes**:
<pre>
id, xml:base, content-type, country, specific-use, xml:lang
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|alternatives|inline-graphic|private-char|chem-struct|inline-formula|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
element-citation
</pre>

### `<permissions>`

**Attributes**:
<pre>
id, xml:base
</pre>
**Contains**:
<pre>
copyright-statement*,copyright-year*,copyright-holder*,(ali:free_to_read|license)*
</pre>
**This element may be contained in:**
<pre>
article-meta, fig, table-wrap
</pre>

### `<person-group>`

**Attributes**:
<pre>
id, xml:base, person-group-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
(anonymous|collab|collab-alternatives|name|name-alternatives|string-name|aff|aff-alternatives|etal|role)*
</pre>
**This element may be contained in:**
<pre>
element-citation
</pre>

### `<phone>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|alternatives|inline-graphic|private-char|chem-struct|inline-formula|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
aff
</pre>

### `<postal-code>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
aff
</pre>

### `<prefix>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|alternatives|inline-graphic|private-char|chem-struct|inline-formula|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
name
</pre>

### `<preformat>`

**Attributes**:
<pre>
id, xml:base, position, orientation, specific-use, xml:lang, preformat-type, xml:space
</pre>
**Contains**:
<pre>
(TEXT|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|abbrev|milestone-end|milestone-start|named-content|styled-content|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
body, sec
</pre>

### `<price>`

**Attributes**:
<pre>
id, xml:base, currency, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
(TEXT|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby)*
</pre>
**This element may be contained in:**
<pre>
license-p
</pre>

### `<pub-date>`

**Attributes**:
<pre>
id, xml:base, pub-type, publication-format, date-type, iso-8601-date, calendar, xml:lang
</pre>
**Contains**:
<pre>
(day|era|month|season|year|string-date)*
</pre>
**This element may be contained in:**
<pre>
article-meta
</pre>

### `<pub-id>`

**Attributes**:
<pre>
id, xml:base, pub-id-type, assigning-authority, specific-use, xlink:type, xlink:href, xlink:role, xlink:title, xlink:show, xlink:actuate
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
element-citation
</pre>

### `<publisher-loc>`

**Attributes**:
<pre>
id, xml:base, specific-use, xml:lang
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
element-citation
</pre>

### `<publisher-name>`

**Attributes**:
<pre>
id, xml:base, specific-use, xml:lang
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
element-citation
</pre>

### `<ref>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
element-citation
</pre>
**This element may be contained in:**
<pre>
ref-list
</pre>

### `<ref-list>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
ref*
</pre>
**This element may be contained in:**
<pre>
back
</pre>

### `<role>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|alternatives|inline-graphic|private-char|chem-struct|inline-formula|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
contrib, person-group
</pre>

### `<sc>`

**Attributes**:
<pre>
id, xml:base, toggle, specific-use
</pre>
**Contains**:
<pre>
(TEXT|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
article-title, attrib, bold, chapter-title, data-title, edition, email, ext-link, fixed-case, given-names, institution, italic, kwd, label, license-p, monospace, overline, p, part-title, patent, phone, prefix, preformat, price, role, sc, series, source, strike, string-name, sub, subject, suffix, sup, surname, td, th, title, trans-title, underline, uri, version, xref
</pre>

### `<season>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
date, pub-date
</pre>

### `<sec>`

**Attributes**:
<pre>
id, xml:base, xml:lang, sec-type, disp-level, specific-use
</pre>
**Contains**:
<pre>
title?,(boxed-text|chem-struct-wrap|code|fig|fig-group|table-wrap|disp-formula|disp-formula-group|def-list|list|p|preformat|disp-quote|disp-formula|disp-formula-group|def-list|list|p|ack|disp-quote|speech|statement|verse-group)*,sec*
</pre>
**This element may be contained in:**
<pre>
body, sec
</pre>

### `<series>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|alternatives|inline-graphic|private-char|chem-struct|inline-formula|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
element-citation
</pre>

### `<source>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
(TEXT|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
element-citation
</pre>

### `<state>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
aff
</pre>

### `<strike>`

**Attributes**:
<pre>
id, xml:base, toggle, specific-use
</pre>
**Contains**:
<pre>
(TEXT|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
article-title, attrib, bold, chapter-title, data-title, edition, email, ext-link, fixed-case, given-names, institution, italic, kwd, label, license-p, monospace, overline, p, part-title, patent, phone, prefix, preformat, price, role, sc, series, source, strike, string-name, sub, subject, suffix, sup, surname, td, th, title, trans-title, underline, uri, version, xref
</pre>

### `<string-date>`

**Attributes**:
<pre>
id, xml:base, iso-8601-date, calendar, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
date, pub-date
</pre>

### `<string-name>`

**Attributes**:
<pre>
id, xml:base, content-type, name-style, specific-use, xml:lang
</pre>
**Contains**:
<pre>
(TEXT|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
contrib, name-alternatives, person-group
</pre>

### `<sub>`

**Attributes**:
<pre>
id, xml:base, arrange, specific-use
</pre>
**Contains**:
<pre>
(TEXT|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
article-title, attrib, bold, chapter-title, data-title, edition, email, ext-link, fixed-case, given-names, institution, italic, kwd, label, license-p, monospace, overline, p, part-title, patent, phone, prefix, preformat, role, sc, series, source, strike, string-name, sub, subject, suffix, sup, surname, td, th, title, trans-title, underline, uri, version, xref
</pre>

### `<subj-group>`

**Attributes**:
<pre>
id, xml:base, subj-group-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
(subject|compound-subject)+,subj-group*
</pre>
**This element may be contained in:**
<pre>
article-categories, subj-group
</pre>

### `<subject>`

**Attributes**:
<pre>
id, xml:base, content-type
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|alternatives|inline-graphic|private-char|chem-struct|inline-formula|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup|break)*
</pre>
**This element may be contained in:**
<pre>
subj-group
</pre>

### `<suffix>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|alternatives|inline-graphic|private-char|chem-struct|inline-formula|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
name
</pre>

### `<sup>`

**Attributes**:
<pre>
id, xml:base, arrange, specific-use
</pre>
**Contains**:
<pre>
(TEXT|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
article-title, attrib, bold, chapter-title, data-title, edition, email, ext-link, fixed-case, given-names, institution, italic, kwd, label, license-p, monospace, overline, p, part-title, patent, phone, prefix, preformat, role, sc, series, source, strike, string-name, sub, subject, suffix, sup, surname, td, th, title, trans-title, underline, uri, version, xref
</pre>

### `<surname>`

**Attributes**:
<pre>
id, xml:base, initials
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|alternatives|inline-graphic|private-char|chem-struct|inline-formula|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
name
</pre>

### `<table>`

**Attributes**:
<pre>
id, xml:base, content-type, style, summary, width, border, frame, rules, cellspacing, cellpadding, specific-use
</pre>
**Contains**:
<pre>
(col*|colgroup*),((thead?,tfoot?,tbody+)|tr+)
</pre>
**This element may be contained in:**
<pre>
table-wrap
</pre>

### `<table-wrap>`

**Attributes**:
<pre>
id, xml:base, position, orientation, specific-use, xml:lang, content-type
</pre>
**Contains**:
<pre>
object-id?,label?,caption?,table,permissions?
</pre>
**This element may be contained in:**
<pre>
body, sec
</pre>

### `<tbody>`

**Attributes**:
<pre>
id, xml:base, content-type, style, align, char, charoff, valign
</pre>
**Contains**:
<pre>
tr+
</pre>
**This element may be contained in:**
<pre>
table
</pre>

### `<td>`

**Attributes**:
<pre>
id, xml:base, content-type, style, abbr, axis, headers, scope, rowspan, colspan, align, char, charoff, valign
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|alternatives|inline-graphic|private-char|chem-struct|inline-formula|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
tr
</pre>

### `<tex-math>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, notation, version
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
inline-formula
</pre>

### `<tfoot>`

**Attributes**:
<pre>
id, xml:base, content-type, style, align, char, charoff, valign
</pre>
**Contains**:
<pre>
tr+
</pre>
**This element may be contained in:**
<pre>
table
</pre>

### `<th>`

**Attributes**:
<pre>
id, xml:base, content-type, style, abbr, axis, headers, scope, rowspan, colspan, align, char, charoff, valign
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|alternatives|inline-graphic|private-char|chem-struct|inline-formula|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
tr
</pre>

### `<thead>`

**Attributes**:
<pre>
id, xml:base, content-type, style, align, char, charoff, valign
</pre>
**Contains**:
<pre>
tr+
</pre>
**This element may be contained in:**
<pre>
table
</pre>

### `<title>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|alternatives|inline-graphic|private-char|chem-struct|inline-formula|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup|break)*
</pre>
**This element may be contained in:**
<pre>
caption, fn-group, kwd-group, sec
</pre>

### `<title-group>`

**Attributes**:
<pre>
id, xml:base
</pre>
**Contains**:
<pre>
article-title,trans-title-group*
</pre>
**This element may be contained in:**
<pre>
article-meta
</pre>

### `<tr>`

**Attributes**:
<pre>
id, xml:base, content-type, style, align, char, charoff, valign
</pre>
**Contains**:
<pre>
(th|td)+
</pre>
**This element may be contained in:**
<pre>
table, tbody, tfoot, thead
</pre>

### `<trans-abstract>`

**Attributes**:
<pre>
id, xml:base, abstract-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
p*
</pre>
**This element may be contained in:**
<pre>
article-meta
</pre>

### `<trans-title>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|alternatives|inline-graphic|private-char|chem-struct|inline-formula|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup|break)*
</pre>
**This element may be contained in:**
<pre>
trans-title-group
</pre>

### `<trans-title-group>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
trans-title,trans-subtitle*
</pre>
**This element may be contained in:**
<pre>
title-group
</pre>

### `<underline>`

**Attributes**:
<pre>
id, xml:base, toggle, underline-style, specific-use
</pre>
**Contains**:
<pre>
(TEXT|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
article-title, attrib, bold, chapter-title, data-title, edition, email, ext-link, fixed-case, given-names, institution, italic, kwd, label, license-p, monospace, overline, p, part-title, patent, phone, prefix, preformat, price, role, sc, series, source, strike, string-name, sub, subject, suffix, sup, surname, td, th, title, trans-title, underline, uri, version, xref
</pre>

### `<uri>`

**Attributes**:
<pre>
id, xml:base, content-type, specific-use, xml:lang, xlink:type, xlink:href, xlink:role, xlink:title, xlink:show, xlink:actuate
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|alternatives|inline-graphic|private-char|chem-struct|inline-formula|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
aff, data-title, element-citation
</pre>

### `<version>`

**Attributes**:
<pre>
id, xml:base, designator, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|alternatives|inline-graphic|private-char|chem-struct|inline-formula|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup)*
</pre>
**This element may be contained in:**
<pre>
element-citation
</pre>

### `<volume>`

**Attributes**:
<pre>
id, xml:base, seq, content-type, specific-use, xml:lang
</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
article-meta, element-citation
</pre>

### `<xref>`

**Attributes**:
<pre>
id, xml:base, ref-type, alt, rid, specific-use, xml:lang
</pre>
**Contains**:
<pre>
(TEXT|ext-link|inline-supplementary-material|bold|fixed-case|italic|monospace|overline|overline-start|overline-end|roman|sans-serif|sc|strike|underline|underline-start|underline-end|ruby|alternatives|inline-graphic|private-char|chem-struct|inline-formula|abbrev|milestone-end|milestone-start|named-content|styled-content|target|xref|sub|sup|break)*
</pre>
**This element may be contained in:**
<pre>
article-title, chapter-title, collab, contrib, edition, email, ext-link, given-names, institution, kwd, label, license-p, p, part-title, patent, phone, prefix, role, series, subject, suffix, surname, td, th, title, trans-title, uri, version, xref
</pre>

### `<year>`

**Attributes**:
<pre>

</pre>
**Contains**:
<pre>
TEXT
</pre>
**This element may be contained in:**
<pre>
date, element-citation, pub-date
</pre>

## Not Implemented

These elements have not been implemented yet and need go through the recommendation process.
If you want to contribute, go to [https://github.com/substance/texture/issues](https://github.com/substance/texture/issues)
and open a request if it does not exist yet. Please provide one ore multiple XML examples
and explanations that help understanding the use-case.

- abbrev
- abbrev-journal-title
- ack
- address
- aff-alternatives
- alt-text
- alt-title
- alternatives
- annotation
- anonymous
- app
- app-group
- array
- author-comment
- author-notes
- boxed-text
- chem-struct
- chem-struct-wrap
- citation-alternatives
- collab-alternatives
- comment
- compound-kwd
- compound-kwd-part
- compound-subject
- compound-subject-part
- conf-acronym
- conf-date
- conf-num
- conf-sponsor
- conf-theme
- conference
- corresp
- count
- counts
- custom-meta
- custom-meta-group
- def
- def-head
- def-item
- def-list
- degrees
- disp-formula
- disp-formula-group
- equation-count
- etal
- fig-count
- fig-group
- floats-group
- front-stub
- funding-statement
- glossary
- glyph-data
- glyph-ref
- gov
- hr
- inline-graphic
- inline-supplementary-material
- issn
- issn-l
- issue-id
- issue-part
- issue-sponsor
- issue-title
- journal-id
- journal-meta
- journal-subtitle
- journal-title
- journal-title-group
- long-desc
- media
- meta-name
- meta-value
- milestone-end
- milestone-start
- mixed-citation
- nested-kwd
- note
- notes
- on-behalf-of
- open-access
- overline-end
- overline-start
- page-count
- principal-award-recipient
- principal-investigator
- private-char
- product
- publisher
- rb
- ref-count
- related-article
- related-object
- response
- roman
- rp
- rt
- ruby
- sans-serif
- sec-meta
- self-uri
- series-text
- series-title
- sig
- sig-block
- size
- speaker
- speech
- statement
- std
- std-organization
- string-conf
- styled-content
- sub-article
- subtitle
- supplement
- supplementary-material
- table-count
- table-wrap-foot
- table-wrap-group
- target
- term
- term-head
- textual-form
- trans-source
- trans-subtitle
- underline-end
- underline-start
- unstructured-kwd-group
- verse-group
- verse-line
- volume-id
- volume-issue-group
- volume-series
- word-count