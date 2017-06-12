52. Introduce `<body-content>`

We prefer to wrap content from meta-data.

51. Introduce `<abstract-content>`

We prefer to wrap content from meta-data.

50. Restrict `<textual-form>`

In JATS 1.1 `<textual-form>` is a text node, but also allows for `<label>` which
is otherwise used in structured content. We remove `<label>` from its content.

49. Restrict `<abbrev>`

In JATS 1.1 `<abbrev>` allows for `<def>` inline with the textual content.
This makes the usage of `<def>` inconsistent. We suggest to use footnotes instead
in such cases.

48. Redesign `<preformat>`

In JATS 1.1 `<preformat>` has mixed content.
While the textual content seems to be the primary use-case, there are some
structural elements allowed: `<alt-text>`, `<long-desc>`, `<attrib>`, and `<permissions>`.

We would prefer a way to separate these two groups of content.
For now, we disable the structural content until we have found a proper way to specify the mixed version.

> TODO: find a proper way to specify such not-so-mixed elements without introducing
> For example, `(alt-text?,long-desc?,attrib?,permissions?,(PCDATA | ...)*)`

47. Restrict `<license-p>`

Removing `<price>` as annotation, which is used in structured content by `<product>`

For compatibility with JATS, we will convert `<price>` into `<named-content>`.

46. Restrict `<publisher-name>`

Turning this into a purely textual element

45. Restrict `<on-behalf-of>`

Turning this into a purely textual element

44. Restrict `<funding-source>`

Turning this into a purely textual element

43. Restrict `<copyright-holder>`

Turning this into a purely textual element

42. Restrict `<conf-sponsor>`

Turning this into a purely textual element

41. Restrict `<principal-investigator>`

Turning this into a purely structural element

40. Restrict `<principal-award-recipient>`

Turning this into a purely structural element

39. Restrict `<std>` and `<std-organization>`

Turning `<std>` into a purely textual element, and `<std-organization>` into an inline-element.

> Note: standard is lacking of an equally expressive, structured representation.

38. No inline-definition of `<fn>`

In favor of one consistent model, we remove `<fn>` from inline-elements.
Instead we prefer to define `<fn>` in `<fn-group>` as part of `<front>` (like other resources)
and use `<xref>` to create a link within the text.

> Note: this will cause a lot of problems with existing JATS files, as `<fn>` is used
  as inline element a lot. Still, it should be easy to fix this automatically,
  by moving all `<fn>s` to `<fn-group>s` and inserting `<xref>s` (if not yet there)

37. Redesign `<def-list>` et al.

In our opinion there are too many degrees of freedom in the original specification of `<def-list>`.
We want to try out a much more restrictive schema.


> List in which each item consists of two parts: 1) a word, phrase, term, graphic, chemical structure, or equation, that
  is paired with 2) one or more descriptions, discussions, explanations, or definitions of it.

Altogether `<def-list>` seems to be sort of a 2-column table, where the left column can contain either text or a
structured element such as an equation. The right-hand side, `<def>` can contain simple text or a sequence of
block-level elements.

> TODO: we do not understand how nesting of definition lists should work other than allowing definition lists
  as content of the definition

Proposal:

```
def-list :==
(label?, title?, term-head?, def-head?, def-item*)

def-item :==
(label?, term, def)

term :==
( (PCDATA | phrasing content)+ | (block-level content) )?

def :==
p+
```

> Note: allowing different content than `<p>` as children of `<def>` is incompatible with JATS 1.1


36. Redesign `<td>` and `<th>`

While `<td>` and `<th>` are similar to the HTML specification,
we want to introduce a slightly stricter schema, separating phrasing content
from structural content.

For mixed content only those elements are allowed, which can occur in inline content,
such as annotations, anchors, and inline-elements.

```
<td>123<bold>456</bold>789</td>
```

On the other hand, only block-level elements are allowed to occur together

```
<td>
  <p>...</p>
  <list>...</list>
  <p>...</p>
</td>
```

35. Restrict `<speaker>`

This tag seems to be used in `<speech>` elements, for the tiny headings
denoting a speaking person such as in this example:

```
<speaker>A:</speaker>
<p>...</p>
<speaker>B:</speaker>
<p>...</p>
```

We think this can be purely textual. For tagging meta-data about
the person `<contrib>` should be used.

34. Restrict `<supplement>`

Turning this into a purely textual element.

> Note: we think instead of defining a `<contrib-group>` inside this tag
  an `<xref>` should be used instead.

33. Restrict `<history>`

Turning this into a purely structured element.

32. Restrict `<string-name>`

Turning this into a purely textual element.

31. Restrict `<string-date>`

Turning this into a purely textual element.

30. Restrict `<date-in-citation>`

Turning this into a purely structured element.

29. Restrict `<conf-date>`

Turning this into a purely structured element.

28. Remove deprecated `<access-date>` and `<time-stamp>`

27. Restrict `<addr-line>`

We prefer not to mix structured address elements with this textual component.

26. Restrict `<funding-statement>`

We turn this into a purely structured element.
It would be nice to have a dedicated wrapper element for the description.
For compatibility with JATS 1.1 we will use `<alternatives>` to wrap the description.

Proposal:
```
<funding-statement>
  <description>...</description>
  <award-id></award-id>
</funding-statement>
```

Workaround:

```
<funding-statement>
  <alternatives>
    <textual-form>...</textual-form>
  </alternatives>
  <award-id></award-id>
</funding-statement>
```

25. Restrict `<title>`

Should not allow for inline citations.

24. Restrict `<string-conf>`

It looks like the original intend of this tag is a means to provide
a textual representation of the conference. As with other tags allowing
for mixed content we want to use it purely with phrasing content.

> TODO: investigate the impact of this restricting, and evolve
> a transformation for legacy.

23. Use `<ext-link>` inline only

Use `<email>` and `<uri>` in structured context.

22. Remove `<email>` and `<uri>` from `all-phrase`, `<code>`, and `<data-title>`

Use `<ext-link>` with `@ext-link-type` to create links and use these only
in structured content.

21. Restrict `<product>`

We want it to be used purely structurely.

For a rendered version of the product record we will use

```
<alternatives>
  <textual-form>...</textual-form>
</alternatives>
```

> TODO: investigate the impact of this restricting, and evolve
> a transformation for legacy.

20. Restrict `<related-object>`

We want it to be used only in `<article-meta>`, and referenced using `<xref>`.
It should itself be a purely structural element.

19. Restrict `<related-article>`

We want it to be used only in `<article-meta>`, and referenced using `<xref>`.
It should itself be a purely structural element.

18. Drop `<inline-supplementary-material>`

We want to use `<supplementary-material>` and `<xref>`, instead.

> TODO: investigate the impact of this restricting, and evolve
> a transformation for legacy.

17. Simplify `article-link.class`

We think `<xref>` is enough to create links to resources.
- `<inline-supplementary-material>`: `ref-type="supplementary-material"`
- `<related-article>`: `ref-type="related-article"`
- `<related-object>`: `ref-type="related-object"`

16. Redesign `<chem-struct>`

We want it to be used purely structurely.

> TODO: investigate the impact of this restricting, and evolve
> a transformation for legacy.

15. Redesign `<alternatives>`

In JATS 1.1. this has an inconsistent specification,
mixing inline and block-level content

> TODO: we should evaluate how this is used and come up with an
> improved model.

14. Redesign `<sig-block>` and `<sig>`

As of JATS 1.1 `<sig>` very much 'free' form without a good structure.
It looks like `<sig>` is a very visual structure composed of lines of text
together with graphics. We would prefer to introduce a `<sig-line>` element
instead of mixing text, `<break>` and `<graphic>`.
For sake of compatibility we could use `<x>` instead of a `<sig-line>`.

> TODO: we should evaluate how this is used and come up with an
> improved model.

13. Restrict `<person-group>`

We want it to be used purely structurely.

> TODO: investigate the impact of this restricting, and evolve
> a transformation for legacy.

12. Restrict `<publisher-loc>`

This seems to be intended for textual content mainly.

> TODO: investigate the impact of this restricting, and evolve
> a transformation for legacy.

11. Restrict `<corresp>`

We want it to be used purely structurely.

> TODO: investigate the impact of this restricting, and evolve
> a transformation for legacy.

10. Restrict `<conf-loc>`

All examples in JATS 1.1 indicate that this is used primarily with textual content.

9. Redesign `<collab>`

We want it to be used purely structurely.

> TODO: investigate the impact of this restricting, and evolve
> a transformation for legacy.

8. Redesign `<aff>`

We want it to be used purely structurely.

> TODO: investigate the impact of this restricting, and evolve
> a transformation for legacy.

7. Restrict `<p>` to pure inline content

In JATS 1.1 `<p>` establishes a leak to inject block-level content
(e.g. `<fig>`) into inline content.
We are removing support for such elements, and instead splitting
a `<p>` into multiple blocks.

> TODO: To retain the same expressiveness, all parents of `<p>` should allow
all necessary block-level types. For this we need to find out, which
of these block-level elements have defacto been used, e.g., within a `<fn>`

6. Restrict `<styled-content>` to pure inline content

> Attention: we will not support wrapping block-level content

> TODO: investigate the impact of this restriction

5. Restrict `<named-content>` to pure inline content

> Attention: we will not support wrapping block-level content

> TODO: investigate the impact of this restriction

4. Redesign citations (`<element-citation>`, `<mixed-citation>`, etc.)

`<element-citation>` should be purely structural,
not allowing for inline content.

`<mixed-citation>` is in our sense redundant to a
combination of `<element-citation>` plus `<x>`.

Removing `<nlm-citation>`.

For compatibility with JATS 1.1 we need to transform `<mixed-citation>`
into `<element-citation>` if not present, and replace it with a `<x>`.

3. Remove `math.class` from general phrase content

Use `<disp-formula>` and `<inline-formula>` instead.

2. Redesigning `<inline-formula>`

Similar to the changes for `<disp-formula>`.

Proposal:
```
(x | preformat | code | mml:math | tex-math | graphic | alternatives)
```

1. Redesigning `<disp-formula>`

`<disp-formula>` allows for unstructured content, probably to make it more
convenient to write manually. Instead, this element could be defined
much more restrictively in purely structural way.

Proposal:
```
label?,
abstract*,
kwd-group*,
(alt-text | long-desc)*,
(x | preformat | code | mml:math | text-math | graphic | array | alternatives),
(attrib | permissions)*
```

Wrap the source in some way:
- `<tex-math>`: for latex source
- `<mml:math>`: for MathML source
- `<code>`: for other source types
- `<x>`: rendered
- `<preformat>`: preformatted

```
<disp-formula>
    <preformat>f(x) = x<sup>2</sup></preformat>
</disp-formula>
```

If you want to provide multiple source-types at the same time:

```
<disp-formula>
    <alternatives>
        <textual-form>f(x) = x<sup>2</sup></textual-form>
        <code code-type="tex">f(x) = x^2</code>
        <mml:math>...</mml:math>
    </alternatives>
</disp-formula>
```

TODO: either `<alternatives>` should be generalized, or a dedicated `<formula-alternatives>` should be introduced. For the first, it would be nice to be able
to restrict the schema in a context-sensitive way.

TODO: evaluate how `<disp-formula>` is used in the wild.
A transformation would transform unstructured formulas into structured ones,
by wrapping inline content into a `<x>` element. Other structured content
would be rearranged to fulfill the proposed schema.