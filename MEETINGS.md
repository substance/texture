## 2018-09-04

Call with PKP, eLife, Erudit, SciELO mainly to coordinate before the Texture Consortium Meetup in Sao Paulo end of September.

Notes:

- Giuliano: Work towards lighter and more stable UI
  - Include eLife Designer Chris to provide suggestions and improvements
- Michael: Suggest to collect requirements and issues
- Melissa: Collect requirements to get Texture into a version that can be used under 'real' condition
- Fabio: Blocker for Erudit: Texture must be able to load a range of files and not loose data
- Oliver: Get blockers out of the way
- Melissa: All concepts should be provided in kitchen_sink XML so everyone can look and see if all needed data is captured in Dar
- Michael: Could we acchieve some knowledge transfer, so developers at organisations get familiar with the Texture codebase and change configuration and code. Not to be dependent on Substance on each issue
- Melissa: Knowledge transfer to vendors as eLife does not have 
- Michael: Current main goal is to get feature-complete content-wise. After that iterating on integration and conversion topcis.
- Melissa: Important to get real content into Texture
- Fabio: Summarizing....
   - try to identify issues not yet addressed, consortium members should try to come up with prios for follow up issues
   - plan for future contribution / financing
   - plan for integration into existing systems
   - talk about funding situation (improve how this is communicated)
- Juan Pablo: Share agenda as Google Doc for Sao Paulo
- Michael: Goal for Sao Paulo is
   - Everyone knows where Texture exactly is (features implemented)
   - And where it should go (create issue list of all blockers before real use is possible)
- Another call where Fabio can demonstrate stub platform integration of Erudit
  - Use OJS to convert PDF/Word
  - run Texture
  - Result Texture Dar/JATS + Erudit XML format

Next Actions Substance:

- Release Texture 1.0
- Provide Agenda for Consortium Meetup
- Describe possible options for integration (Desktop app, web platform integration)
- Set up another call where Fabio can demonstrate integration at Erudit

Next Actions Contributors:

- Review [Milestone 1](https://github.com/substance/texture/issues?q=is%3Aopen+is%3Aissue+milestone%3A1.0.0) Issues

## 2018-04-13

Consortium Meetup in Cambridge Day 2.

Notes:

- Texture Introduction for Cambridge University Press (Katie Silvester, Alex Wotherspoon)
- Demo by Nick Stiffler: InSilico/Database Hyperlinking
- Demo of Archivist (another application that uses tagging of concepts in prose)
- Requirements
  - Permissions
    - We need to evaluate and implement support for permissions/attributions
    - Article level, figures,
    - Follow [JATS4R recommendation](https://jats4r.org/permissions)
    - Discussed license references
      - Idea is to have a unique identifier for a license, and be able to query for articles of a license later
    - Can get complicated for figures (multiple permissions on one object)
      - We need to support this in the Dar specification, but we should not complicate the UI for those edge cases
  - Support figure groups
    - Primarily used for supplementary figures (e.g. at eLife)
    - Discussed if we can have structured / multi-panel figures
      - Interesting, but not a priority atm
    - Ability drop an additional image on an existing figure
      - Creates a stack (see eLife UI)
      - Ability to modify the stack (cycle through images, delete individual images etc.)
- Discussion: Generate printable version from Dar
  - Provide simple one-column layout in good quality
  - Options:
    - Use CSS Paged media properties
    - Use a traditional Java stack for PDF generation (Tamir Hassan has a prototype)
    - Use LaTeX for PDF generation
  - Decision: Evaluation of CSS Paged media capabilities as it would be the most lightweight solution
- New Initiative started for semantic extraction of content from Word
  - Led by eLife (Paul Shannon)
  - An R&D effort to improve the situation on Word/PDF to JATS/Dar conversion
  - Daniel Ecer of eLife will apply computer vision strategies (from [ScienceBeam project](https://elifesciences.org/labs/5b56aff6/sciencebeam-using-computer-vision-to-extract-pdf-data))
  - PKP will provide evaluation framework (set of source files + manually curated high quality XML version to match against)
  - Alex Garnett will provide expertise on available tools (as used by Open Typesetting Stack)
- Discussion about Consortium Memberships
  - We will continue as now with individual SOW's
  - Once Texture is used in production, we may switch to membership model (yearly subscription)
  - Roadmap
    - 3 milestones (Early June, Early August, Late September 1.0 release)
    - After each milestone, testing by consortium members
- Decision: Juan Pablo Alperin will create a proposal for Force 2018 in Montreal


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
