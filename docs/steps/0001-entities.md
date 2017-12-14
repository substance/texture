# Entities

In Texture Alpha 4 we are introducing entity editing. The overall goal is to identify global/reusable entities (persons, organisations, bibliographic records) and maintain them in a database separate from the article XML. This lets a publisher build records for reuse.

## Open Questions

- When I create a new reference, can I have fields pre-populated with data from Crossref?
- Can we make adding references manually more efficient (e.g. adding authors one by one takes time at the moment)
- Should we separate the "create a new entity" function from the "add (select) a new function? According to feedback it is confusing
  - Background: We used this approach to make the process faster.  E.g. to insert a new person, just type out the name and select "Create Person" -> data will be pre-filled. If we had a separate button for creation, a user would need to fill out the name again. Also you would loose keyboard access.
- Should we provide a "Recents" list (when focused search field is empty)
- Should we add field validators. E.g. to reject text input in a number field (year, month)?
- Can we have better disambiguation of records (e.g. for persons show the last recorded institution)?

## Ideas

- Faster authors editing:
  - An entity could have a simple grid view for in place editing to speed up the process
  - Use Macro: E.g. enter `Melissa Harrison;Giuliano Maciocci;Graham Nott` for batch creation.
- Avoid confusion between inserting and selecting
  - It should be possible to use explanatory interfaces with the mouse that don't need special knowledge, but we should allow for macro/power modes
  - In addition to explicit create button, we allow entering `+Michael Aufreiter;Oliver Buchtala` which then is interpreted as an insertion. Instead of the dropdown for selecting the UI would display insertion options `Insert 2 Persons: Michael Aufreiter and Oliver Buchtala`
  Insert 2 Organisations: Michael Aufreiter and Oliver Buchtala
- To request prefilling of form fields (e.g. for references) you could type `+<DOI>` and then get presented a prefilled form


## Implementation

### Iteration I - Basic entity editing (Done)

Goal: A generated user interface, derived from the schema. Ability to select existing references, persons, organisations or create them via user interface.

### Iteration II - Stable converters for mapping JATS4M to entities

Goal: Use JATS4M as an input and map to entity nodes and improve entity editing interface

- Define converter interface for entities that reads close to a spec, but without introducing a declarative layer
- JATS4M stores an optional entityId for references, organisations, persons which should be recognised by the importer (no new entry is created instead we link to an existing one, e.g. in a shared entity db)
- Would be good to store as many guids (DOI, ORCID) with the JATS contents. This would allow us to use a set of JATS articles to build a seed for an initial entity database
- OPTIONAL: Let the converter detect duplicates (e.g. use exact match surname+givenames between multiple records)
- OPTIONAL: Store entities.json as a local (document-specific) entity database in addition to the JATS contents. This allows us to eliminate duplicates within the scope of one document, thus we can simulate the shared database use-case (e.g. ingest from word, then link with the real entities). We would also need to provide a UI for linking, and eliminating duplicates

### Iteration III - Connect with Crossref

Goal: Allow users to pre-populate form fields with data from Crossref / Datacite when creating new citation entities

- Workflow: Prompt for DOI and get a form-field with pre-populated data, this can be adjusted before saved (e.g. annotate article title)
- develop a service stub that returns an entity db citation record (this interface should be independent of the service behind it, e.g. it could be backed by CrossRef, PubMed)
- write a mapper from Crossref JSON / PubMed format to our entity model

### Iteration IV - Publisher-owned entity database

Goal: Let journals maintain a database for reuse of records in articles.

### Iteration V - Shared entity database between organisations

Goal: Let organisations benefit from a shared database, where high quality entities are managed and verified.
