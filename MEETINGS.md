## 2018-04-12

Consortium Meetup in Cambridge Day 1.

Notes:

- Demo of Texture Preview 2 (soon to be released)
  - Texture Desktop
  - Full support for references
  - Minimal authoring mode (do not show empty references list, abstract, authors etc.)
  - Drag and drop images from the Desktop
  - Dar format (storage as an archive into a folder on the file system)
  - Simplified UI/UX for reference editing
  - Import bibliography from CSL/JSON (e.g. import from a Zotero library)
  - Insert reference via DOI (DataCite is queried)
  - Add row/column to table
- Feedback from the demos
  - We need filtering of references on citing (e.g. when there are 100 references in a doc)
  - Can we add a macro that when typing "@fig" we can choose from existing figures via keyboard
  - When importing CSL/JSON we should overwrite existing entries
  - Juan: Is there a way to use a full library (like Zotero to pick from)
  - Allow entering PMIDs and fetch them from PubMed
  - Erudit needs unstructured references (as they only have unstructured Word input) and not enough resources to structure them
    - as a consequence we would need to support manual editing of citation labels (since we can't generate them when there is no structured record)
  - Idea: Validate a document against a Schematron rule set (lower priority)
- Dar Specification
  - Decision: We agreed on a tagging style for lists
  - Decision: We agreed that we want to handle Page-Range in a single field for easier entering of data. Also to not support multiple page ranges.
  - Decision: We agreed on a tagging style for author bios
  - Decision: We agreed on certain level of group author support
    - Support collab element in person-group in references
    - Support collab element in contrib-group in article meta
      - Specify people
      - No subgroups
      - No affiliations for groups
  - Decision : Multi-language Support for title, abstract, keywords.
  - Decision: Add support for structured abstracts; allow sections.
- Discussion of Quality Checking View
  - This should be implemented as a separate component, that can be used independently of the editor
  - We want one component that can live in different contexts (Texture web integration, xPub submission or production masks)
- Discussion of Texture providing tools for rendering HTML fragments (aka Texture Reader)
  - A utility to render the body, abstract, title, reference list etc. of an article
  - This can then be used by to create a stand-alone web publication, or be integrated with journal's rendering pipelines (e.g. eLife's Libero)
  - This must be modular and run in Javascript (so no server-side language is required)
- XML Editor View
  - Purpose: Ability to edit content that we don't have an interface format
  - Provide API so custom UI's can be built while using Texture's model
- Support Funder Registry verification #476

Next Actions Substance:

  - Provide updated Dar specification and send to consortium members for review
  - Design an API for manipulating Dar archives programatically (e.g. to update metadata)

Next Actions Contributors:

- Review Github issues
- eLife: provide mockups for QC view (based on work for xPub)

## 2018-02-05

Call with consortium members to discuss Alpha 4 release, and plan next steps.

Notes:

- Demo of Alpha 4 release
  - Question Melissa Harrison: Can we support PDF uploads as images?
  - Feedback Nick Duffield: "???" and "[1,?]" for broken cross references is not intuitive
  - Dedicated panel for 'Problems' would help to keep an overview over existing issues
- Discussion of next priorities
  - Agreement that Raw XML view would be really useful
  - To increase adoption at publishers it will be crucial to support most frequently used tagging styles as an input
  - Oliver Buchtal: Converters from different JATS flavours should be become a community project

Next Actions Substance:

- Improve on Alpha 4
- List support
- Reference lookup service
- XML Source Editor
- Group author support
- More mockups for QC Mode
- Mockups for Issues panel

Next Actions Contributors:

- Test Alpha 4 release (setup instructions will be provided)
- Review latest JATS4M spec
- Implement storage backend for Dar archives (e.g. in PHP for OJS)

## 2017-12-15

Call with PKP, eLife, Erudit to discuss entity editing prototype after first round of tests. Decide on next topic to work on. Define tasks to work on before next Texture meetup.

Notes:

- Focus on fast manual editing first, before we connect Crossref etc.
- Work on regular testable milestones
- No efforts to run entity databases at publishers, better invest into improving Crossref data

Next Actions Substance:

- Finishing Alpha 4 iteration (entities, figures, lists)
- Iterate on UI for entity editing (provide UI mockups)
- Provide ideas (mockups) for QC mode

Next Actions Contributors:

- Review latest [JATS4M spec](https://github.com/substance/texture/blob/master/docs/JATS4M.md)
- Adjust Word-Converter to produce JATS4M output
