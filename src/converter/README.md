# JATS conversion

In Texture we use a slight variation of JATS forming a schema that is tailored
to the use within an editor.

Starting from JATS 1.1 we have a set of transformations into restrictedJATS,
which is based on JATS 1.1 with some restrictions to eliminate ambiguities.

In theory, there might be many different slighty varying tagging styles,
but we support only a set of reasonable and commonly agreed versions.
The importer will give more detailed information if a JATS file does not fulfill
the requirements.

On the top of restrictedJATS, Texture applies a set of loss-free conversions into TextureJATS,
which includes some more deviations from original JATS

# JATS improvements

## Disambiguation

Not only from the perspective of an editor application, it is essential to have
an inambigous specification. If JATS is considered an exchange format, this will
increase compatibility and reduce amount of time, and thus costs, for maintaining
different tool implementations.

- `<affiliations>` and `<contrib>`: use `<xref>` to associate an affiliation, instead of inlining them
- `<ref-list>`: only one global `<ref-list>`
- `<fn-group>` and `<fn>`: only one global <fn-group>, no inline definition of <fn>

## Other

- only use <math:ml> inside <disp-formula> or <inline-formula>


# XML Schema for an Editor

## Patterns

We have identified a set of patterns for different purposes as guide-lines for the specification of elements.
Following these patterns leaves only one interpretation and reducing the diversity
of implementation patterns for developing tools.

- Text Node: contains text and inline content, only.
  Example: `<p>`

- Element: does not contain text or inline content.
  In theory the order should not be relevant, only the quantity.
  Example: `<element-citation>`

- Container: an Element nodem, where the order is important, and not the qunatity.
  Example: `<body>`

- Annotation: an element that wraps text that belongs to a Text node.
  The schema should allow any content, as it does not 'own' it.
  Example: `<bold>`

- Inline Element: same as Element, but used inline.
  Example: `<inline-formula>`

## Problems

The patterns should not be mixed, and instead either a new tag should be defined,
or a tag should be restructured to use the basic patterns via composition.
For example, if a text node has non primitive meta data, define it as element,
and use an extra tag just for the text content.

### Examples:

