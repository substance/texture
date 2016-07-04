# Implement a new JATS element

Each JATS element is realized as a [package](https://github.com/substance/scientist/tree/devel/packages/jats/caption), containing a node definition, a converter and a component for rendering / editing.

## Choose the right node type

When you add support for a new element, you have to choose a Substance node type. Use this check list to find out what kind of element it is.

### Text

- Does the element contain annotated text?

Example elements: `<p>`, `<title>`

### Annotation

- Is the element used for formatting, highlighting?
- Can the cursor move inside the element, changing its text?

Example elements: `<bold>`, `<ext-link>`

### Inline

- Does the element behave like a single text character in the text flow?
- Is the element content generated (e.g. a label)?
- Is the element content a graphic?
- Is the content of the node immutable to text editing and can only be deleted as a whole?

Example elements: `<xref>`

### Container

- Does the element define a sequence of nodes?
- Can the order of the nodes be changed by the user?

Example elements: `<body>`, `<front>`, `<back>`, `<sec>`

### DocumentNode

- Does your element not fit into any of the previous types?

Example elements: `<fig>`, `<ref-list>`


## Define a new node class

Use the following examples as a reference implementation.

- [Paragraph](https://github.com/substance/scientist/blob/devel/packages/jats/paragraph/Paragraph.js) (Text Node)
- [ExtLink](https://github.com/substance/scientist/blob/devel/packages/jats/ext-link/ExtLink.js) (Annotation Node)
- [XRef](https://github.com/substance/scientist/blob/devel/packages/jats/xref/XRef.js) (Inline Node)
- [Body](https://github.com/substance/scientist/blob/devel/packages/jats/body/Body.js) (Container Node)
- [Figure](https://github.com/substance/scientist/blob/devel/packages/jats/figure/Figure.js) (Document Node)


## Define a converter

A converter is need to map from JATS XML to Substance document nodes.

- [Paragraph Converter](https://github.com/substance/scientist/blob/devel/packages/jats/paragraph/ParagraphConverter.js) (Text Node)
- [ExtLink Converter](https://github.com/substance/scientist/blob/devel/packages/jats/ext-link/ExtLinkConverter.js) (Annotation Node)
- [XRef Converter](https://github.com/substance/scientist/blob/devel/packages/jats/xref/XRefConverter.js) (Inline Node)
- [Body Converter](https://github.com/substance/scientist/blob/devel/packages/jats/body/BodyConverter.js) (Container Node)
- [Figure Converter](https://github.com/substance/scientist/blob/devel/packages/jats/figure/FigureConverter.js) (Document Node)


## Write a converter test

It's important you test your converter throughly. The following examples can be used as a reference.


- [Paragraph Test](https://github.com/substance/scientist/blob/devel/test/jats/paragraph.test.js) (Text Node)
- [ExtLink Test](https://github.com/substance/scientist/blob/devel/test/jats/ext-link.test.js) (Annotation Node)
- [XRef Test](https://github.com/substance/scientist/blob/devel/test/jats/xref-link.test.js) (Inline Node)
- [Body Test](https://github.com/substance/scientist/blob/devel/test/jats/body-link.test.js) (Container Node)
- [Figure Test](https://github.com/substance/scientist/blob/devel/test/jats/figure.test.js) (Document Node)


## Defining a component

In order to make the content editable, you have to define components for each JATS element.

- [Paragraph Component](https://github.com/substance/scientist/blob/devel/packages/jats/paragraph/Paragraph.js) (Text Node)
- [ExtLink Component](https://github.com/substance/scientist/blob/devel/packages/jats/ext-link/ExtLink.js) (Annotation Node)
- [XRef Component](https://github.com/substance/scientist/blob/devel/packages/jats/xref/XRef.js) (Inline Node)
- [Body Component](https://github.com/substance/scientist/blob/devel/packages/jats/body/Body.js) (Container Node)
- [Figure Component](https://github.com/substance/scientist/blob/devel/packages/jats/figure/Figure.js) (Document Node)
