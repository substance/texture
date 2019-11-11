# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.2](https://github.com/libero/texture/compare/v2.0.1...v0.0.2) (2019-11-11)


### Bug Fixes

* support for elife reference articles. ([f00ae01](https://github.com/libero/texture/commit/f00ae012ed6cced7cc6907557c741b596af5aacc))

## Texture 3.0

- Plugin framework
- Authoring interface is primary
- Source code restructured

## Before

Not available.

## Preview 2

- List support (ordered and unordered as well as mixed)
- Math support
- Improved table editing (heading cells, merge cells, add/remove rows/columns)
- Improved handling of references / citations
- Improved data model and conversion for references
- Standardise rendering of references according to AMA style
- Update to Substance v1.0.0-preview.63

## Preview 1

- Electron Desktop Application
- New article design (similar to eLife's)
- Support for managing reusable entities (persons, organisations, citations)
- Structured author and affiliation editing
- Structured citation editing supporting 12 publication types
- Introduced Document Archive, an abstraction for a self-contained file format including assets
- Added default citation formatter (to be tweaked)
- Drag and drop images from the Desktop
- Storage interface to store manuscript XML + assets
- Generated labels are now exported. E.g. for `<xref>` elements
- Update to Substance v1.0.0-preview.32

## Alpha 3

- Update to Substance Beta 7
- Overhauled schema-driven document model
- Tools are now enabled/disabled contextually (depending on the allowed tags in the JATS spec)
- Structured reference editing
- Edit publisher-specific metadata (such as publication history)
- Advanced copy and paste between applications (e.g. from and to Microsoft Word or Google Docs)
- Added Find and Replace panel

## Alpha 2

- Update to Substance Beta 5
- Front matter editing for title + abstract (JATS `<front>`)
- Editing of authors (create, update and delete contrib elements)
- Create and edit xref elements

## Alpha

Initial release
