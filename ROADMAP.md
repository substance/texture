# Texture Roadmap

This is tentative roadmap for Texture. We are planning ahead for just two release cycles.

## Alpha 4

With Alpha 4 we will reach a feature-complete alpha state for the must-requirements specified in 2016 (see Texture Product brief). The goal of this release is to integrate Texture with publisher's workflows.

#### Reference Editor

We will add advanced support for structured reference editing based on `<element-citation>`. We will develop a proposal for tagging guidelines (see JATS4R-Proposal.md) to allow visual editing. The user will be able to select a `@publication-type` (e.g. `book` or `journal`) and gets presented a form to enter bibliographic data. Editing takes place in the context panel, and while updating the record a preview is rendered. This preview (or display version) of the entry is also stored in the JATS file. It can be used for rendering in reading tools, without having to run a formatter.

#### Affiliations Editor

Ability to edit structured affiliations, complete with data about the institution, department etc. Again, we will develop a tagging guideline for `<aff>` elements that is expressive enough to carry the structured data (source) and a rendered version (display) of the affiliation (see JATS4R-Proposal.md).

#### Virtual file system for assets

We will add a layer of a virtual file system, to represent images and other assets alongside the manuscript. The virtual file system can then be implemented by a web platform, or by a desktop application that uses files on disk for storage.

#### Image manipulation

We will add the ability to upload images in the document. This includes drag+drop of images from the file system, as well as moving them around in the document.


#### Test suite for document transforms

Bugs in JATS->JATS4R or JATS4R->TextureJATS transformations could cause data loss. We need to fully test them.

## Beta 1

Texture enters Beta stage and can be used in practice by publishers and individuals at own risk.

#### Content Insertion

In this iteration we will add missing interfaces for inserting content from scratch, e.g. a table by specifying how many rows/cols it should have, or a figure with a prompt for selecting an image from disk.

#### Advanced Multi Language support

We will add support of editing abstracts, figure captions etc. The plan is to activate a translation mode, that shows all translations in the document, and provides UI element to create and delete translations. The reason we do this in the main editor panel, instead of the metadata section is that we want to have tools like Find&Replace workflows working for translations as well.

#### Track Changes

Same functionality as in Microsoft Word. Can be used for author proofing.

#### General improvements

We will improve general usability and reliability. This includes improved copy&paste, better interfaces for citing references, editing footnotes, and journal metadata.

#### Desktop Application

We will provide integration of Texture into a desktop application. This allows users to open JATS files from disk. It will also support opening a self-contained archive format (essentially a gzipped file that contains the JATS XML file + assets such as images, supplements, etc.).

## Unscheduled

#### Support for group authors

#### Image quality checker

#### PubMed and CrossRef verification of references

Possibility to check references against PubMed and or Crossref and pulling back in mismatch info for the author/editor to update. For Texture we need to develop an interface that allows for querying references online and return an accurate `element-citation`. This service must then be implemented by an embedding platform e.g. querying PubMed and/or CrossRef for data.


### FundRef verification


