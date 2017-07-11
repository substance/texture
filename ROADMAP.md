# Texture Roadmap

This is tentative roadmap for Texture. We try to plan ahead for two release cycles.

## Alpha 4

With Alpha 4 we will reach a feature-complete alpha state for the requirements specified in 2016 (see Texture Product brief). The goal of this release is to integrate Texture with Publisher's workflow

#### Reference Editor

We will add advanced support for structured reference editing based on `<element-citation`>. We will develop a proposal for tagging guidlines (see JATS4R-Proposal.md) to allow visual editing. The user will be able to select a `@publication-type` (e.g. `book` or `journal`) and gets presented a form to enter bibliographic data. Editing takes place in the context panel, and while updating the record a preview is rendered. 

#### Affiliations Editor

Ability to define structured affiliations, complete with data about the institution, department etc. Again, we will develop a tagging guideline for `<aff>` elements that is expressive enough to carry the structured data (source) and a rendered version (display) of the affilation.

#### General improvements

We will improve general usabiltity and reliability. This includes, improved copy&paste, improved interface for 


## Beta 1

Texture enters Beta stage and can be tested by publishers and individuals at own risk.

#### Advanced Multi Language support

We will add support of editing abstracts, figure captions etc. The plan is to activate a translation mode, that shows all translations in the document, and provides UI element to create and delete translations. The reason we do this in the main editor panel, instead of the metadata section is that we want to have tools like Find&Replace workflows working for translations as well.

#### Desktop Application

We will provide integration of Texture into a desktop application, that allows opening JATS files from disk. It will also support opening a self-contained archive format (essentially a gzipped file that contains the JATS XML file + assets such as images, supplement etc.)
