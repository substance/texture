# Authors

## Open Questions

- How to handle ORCID signing/validation? Should we handle that in Texture, or should this be done on platform level (OJS, Xpub)
- Should we allow pre-populating author data (name, affiliations) when entering an ORCID in the create dialog? Note this would need signing/validation in an extra step.
- In the front-matter should we show relationship between authors and affiliations. E.g. with numbered labels as some journals do it?
- Should we make the author and organisation names clickable, for faster editing?
- When an author is removed, should we display a confirmation dialog?

### Iteration I - Basic author editing (Done)

Goal: Allow author editing through the user interface. Actual editing of persons is done via entity editor.

### Iteration II - Group Author editing and conversion plus specify equal contributions.

Goal: Implement support for group authors. This needs proper mapping from and to JATS4M and a decision on a proper tagging style.

- we need bidirectional relationships to properly map group authors. E.g. a group (= an organisation) has members, each member (person) has a backlink (affiliations)
